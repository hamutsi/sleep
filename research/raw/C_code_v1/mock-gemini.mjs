// Local stand-in for generativelanguage.googleapis.com used ONLY to exercise the Worker code paths.
// It asserts the request shape documented in the official REST reference (paths, header, field names).
import http from 'node:http';
const log = [];
const send = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const buf = Buffer.concat(chunks);
  const u = new URL(req.url, 'http://x');
  if (u.pathname.startsWith('/push/')) { // stand-in for a push service (web.push.apple.com)
    log.push({ path: u.pathname, push: { headers: req.headers, bytes: buf.length } });
    res.writeHead(u.pathname === '/push/gone' ? 410 : 201); return res.end();
  }
  const raw = buf.toString(); const body = raw ? JSON.parse(raw) : {};
  const key = req.headers['x-goog-api-key'];
  log.push({ path: u.pathname, search: u.search, key: !!key, body });
  if (req.method === 'GET' && u.pathname === '/__log') return send(res, 200, log);
  if (!key) return send(res, 403, { error: { code: 403, message: 'no key' } });
  const m = u.pathname.match(/^\/v1beta\/models\/([^:]+):(generateContent|streamGenerateContent)$/);
  if (!m) return send(res, 404, { error: { message: 'bad path ' + u.pathname } });
  const [, model, method] = m;
  if (method === 'streamGenerateContent') {
    if (u.searchParams.get('alt') !== 'sse') return send(res, 400, { error: { message: 'alt=sse missing' } });
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    const ev = (o) => res.write(`data: ${JSON.stringify(o)}\r\n\r\n`);
    const part = (t, extra = {}) => ({ candidates: [{ content: { role: 'model', parts: [{ text: t, ...extra }] } }] });
    ev(part('שלו'));
    await new Promise((r) => setTimeout(r, 30));
    // split one SSE event across two TCP writes to exercise the buffer logic
    const s = `data: ${JSON.stringify(part('ם עולם'))}\r\n\r\n`;
    res.write(s.slice(0, 20)); await new Promise((r) => setTimeout(r, 30)); res.write(s.slice(20));
    ev(part('hidden thought', { thought: true }));
    ev({ ...part('!'), usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, totalTokenCount: 15 } });
    return res.end();
  }
  const gc = body.generationConfig || {};
  if (gc.responseMimeType === 'application/json') {
    const img = body.contents?.[0]?.parts?.find((p) => p.inlineData);
    if (!img || !gc.responseJsonSchema) return send(res, 400, { error: { message: 'missing image or schema' } });
    return send(res, 200, { candidates: [{ finishReason: 'STOP', content: { role: 'model', parts: [{ text: JSON.stringify({ items: [{ name: 'אורז', grams: 150, kcal: 195, protein_g: 4, carbs_g: 42, fat_g: 0.4, confidence: 'medium' }], total_kcal: 195, needs_clarification: false }) }] } }], usageMetadata: { promptTokenCount: 1180, candidatesTokenCount: 90 } });
  }
  if (body.tools) {
    const last = body.contents.at(-1);
    const fr = last.parts.find((p) => p.functionResponse);
    if (!fr) {
      return send(res, 200, { candidates: [{ content: { role: 'model', parts: [{ functionCall: { id: 'fc_1', name: 'get_recent_sleep', args: { nights: 7 } }, thoughtSignature: 'SIG-abc' }] } }] });
    }
    const modelTurn = body.contents.at(-2);
    const okSig = modelTurn.role === 'model' && modelTurn.parts[0].thoughtSignature === 'SIG-abc' && fr.functionResponse.id === 'fc_1' && last.role === 'user';
    if (!okSig) return send(res, 400, { error: { message: 'thought signature / id / role not echoed correctly' } });
    return send(res, 200, { candidates: [{ content: { role: 'model', parts: [{ text: 'ממוצע שינה 6.9 שעות' }] } }] });
  }
  send(res, 200, { candidates: [{ content: { role: 'model', parts: [{ text: 'ok ' + model }] } }] });
}).listen(8799, '127.0.0.1', () => console.log('mock gemini on 8799'));
