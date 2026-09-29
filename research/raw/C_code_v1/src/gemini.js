// Gemini generateContent client for Cloudflare Workers (no Node built-ins).
// Endpoint: POST {base}/models/{model}:generateContent | :streamGenerateContent?alt=sse
// Auth: x-goog-api-key header (never ?key= in the URL, it ends up in logs).
const BASE = 'https://generativelanguage.googleapis.com/v1beta';
export const FAST = 'gemini-3.8-flash'; // stable, thinking levels: low|medium|high (minimal = error)

const url = (env, model, method) => `${env.GEMINI_BASE || BASE}/models/${model}:${method}`;
const headers = (env) => ({ 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY });

async function generate(env, body, model = FAST) {
  const r = await fetch(url(env, model, 'generateContent'), {
    method: 'POST', headers: headers(env), body: JSON.stringify({ store: false, ...body }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j?.error?.message || `gemini ${r.status}`), { status: r.status });
  return j;
}
const textOf = (parts = []) => parts.filter((p) => p.text && !p.thought).map((p) => p.text).join('');

// (i) streaming chat -> re-emits a tiny SSE protocol: data:{"t":"..."} ... data:{"done":true,"usage":{...}}
export async function chatStream(env, history, system, signal) {
  const up = await fetch(url(env, FAST, 'streamGenerateContent') + '?alt=sse', {
    method: 'POST', headers: headers(env), signal,
    body: JSON.stringify({
      store: false,
      systemInstruction: { parts: [{ text: system }] },
      contents: history.map((m) => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] })),
      generationConfig: { thinkingConfig: { thinkingLevel: 'LOW' }, maxOutputTokens: 2048 },
    }),
  });
  if (!up.ok || !up.body) {
    return new Response(JSON.stringify({ error: 'upstream', status: up.status }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
  let buf = '', usage = null;
  const send = (c, o) => c.enqueue(`data: ${JSON.stringify(o)}\n\n`);
  const sse = new TransformStream({
    transform(chunk, c) {
      buf += chunk;
      let i;
      while ((i = buf.search(/\r?\n\r?\n/)) >= 0) { // SSE events end with a blank line
        const ev = buf.slice(0, i); buf = buf.slice(i).replace(/^\r?\n\r?\n/, '');
        const data = ev.split(/\r?\n/).filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trimStart()).join('\n');
        if (!data) continue;
        let j; try { j = JSON.parse(data); } catch { continue; }
        if (j.usageMetadata) usage = j.usageMetadata;
        const t = textOf(j.candidates?.[0]?.content?.parts);
        if (t) send(c, { t });
        if (j.promptFeedback?.blockReason) send(c, { blocked: j.promptFeedback.blockReason });
      }
    },
    flush(c) { send(c, { done: true, usage }); },
  });
  return new Response(up.body.pipeThrough(new TextDecoderStream()).pipeThrough(sse).pipeThrough(new TextEncoderStream()), {
    headers: { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store', 'x-accel-buffering': 'no' },
  });
}

// (ii) image + JSON schema (structured output). Send a resized JPEG (<= ~1600px) as base64.
const MEAL = {
  type: 'object',
  properties: {
    items: { type: 'array', items: { type: 'object', properties: {
      name: { type: 'string' }, grams: { type: 'number' }, kcal: { type: 'number' },
      protein_g: { type: 'number' }, carbs_g: { type: 'number' }, fat_g: { type: 'number' },
      confidence: { type: 'string', enum: ['low', 'medium', 'high'] } },
      required: ['name', 'kcal', 'protein_g', 'carbs_g', 'fat_g', 'confidence'] } },
    total_kcal: { type: 'number' },
    needs_clarification: { type: 'boolean' },
  },
  required: ['items', 'total_kcal', 'needs_clarification'],
};
export async function analyzeMeal(env, b64, mimeType = 'image/jpeg') {
  const r = await generate(env, {
    contents: [{ role: 'user', parts: [
      { text: 'Estimate the meal in this photo. Answer in Hebrew names, numbers per item.' }, // text before image (per docs)
      { inlineData: { mimeType, data: b64 } },
    ] }],
    generationConfig: { responseMimeType: 'application/json', responseJsonSchema: MEAL, thinkingConfig: { thinkingLevel: 'LOW' } },
  });
  const cand = r.candidates?.[0];
  if (!cand || cand.finishReason === 'SAFETY') throw new Error('blocked or empty');
  return { meal: JSON.parse(textOf(cand.content.parts)), usage: r.usageMetadata };
}

// (iii) function-calling loop. Push the model's content back VERBATIM (keeps thoughtSignature + id).
const DECLS = [{
  name: 'get_recent_sleep',
  description: 'Return sleep records for the last N nights.',
  parametersJsonSchema: { type: 'object', properties: { nights: { type: 'integer', minimum: 1, maximum: 30 } }, required: ['nights'] },
}];
export async function coachWithTools(env, contents, system, exec, maxSteps = 4) {
  for (let step = 0; step < maxSteps; step++) {
    const r = await generate(env, {
      systemInstruction: { parts: [{ text: system }] }, contents,
      tools: [{ functionDeclarations: DECLS }],
      toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
    });
    const content = r.candidates?.[0]?.content;
    const calls = (content?.parts ?? []).filter((p) => p.functionCall);
    if (!calls.length) return { text: textOf(content?.parts), contents };
    contents.push(content); // model turn incl. functionCall parts + thoughtSignature
    const out = [];
    for (const { functionCall: { id, name, args } } of calls) {
      let response;
      try { response = { result: await exec[name](args) }; } catch (e) { response = { error: String(e.message) }; }
      out.push({ functionResponse: { ...(id && { id }), name, response } });
    }
    contents.push({ role: 'user', parts: out });
  }
  throw new Error('too many tool steps');
}
