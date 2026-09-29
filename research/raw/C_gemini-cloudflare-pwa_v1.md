# Track C: Gemini API, Cloudflare platform, PWA and login persistence (v1)

As of 2026-09-29. Author: research subagent, Track C.
Legend: `[G1]` etc. = source id, URLs in section 7. `TESTED` = I executed it in local workerd (wrangler 4.77.0) or Node 25 against mocks; code is in `C_code_v1/` next to this file. `[UNVERIFIED]` = not confirmed by an official doc or a live test. Nothing here was run against the live Gemini API (no key), Apple push, or an iPhone, and I created no Cloudflare resources (only read-only `list` calls).

Files delivered next to this report, in `C_code_v1/`: `src/{app,auth,gemini,push,seal,cron,index}.js` (production code), `wrangler.toml` (recommended Workers config, placeholders), `migrations/0001_init.sql`, `public/_headers`, `pages-variant/` (Pages adapter with its own config), `gen-vapid.mjs`, `make-verifier.mjs`, `.dev.vars.example`, and the test kit (`test*.mjs`, `mock-gemini.mjs`, `wrangler.test.toml`, `src/test-*.js`, `make-test-vars.mjs`). No real secrets anywhere.

## 0. Decisions in one screen

1. **Model.** `gemini-3.8-flash` (stable, GA 2026-09-02) with `thinkingLevel: LOW` for chat, vision and JSON. Cheap fallback `gemini-3.5-flash-lite`. Heavy reports only: `gemini-3.1-pro-preview` (still Preview, paid only). There is no GA Pro in the Gemini 3 family. Gemini 2.5 is restricted to projects that already used it; 2.0 is shut down. [G1][G2][G4]
2. **Price.** 3.8 Flash is $0.75 in / $3.75 out per 1M tokens until 2026-12-31, then $1.50 / $7.50 from 2027-01-01. A photo costs 1,120 input tokens by default and is billed at the normal input rate. One user should land around $3-7 per month (estimate, section 1.3). [G3][G16][G18]
3. **Privacy.** Free tier: content is used to improve Google products and humans may read it. Paid tier: not used for improvement, but logged 55 days for abuse monitoring. Any key that sees health data must belong to a billing-linked project (prepay, minimum $5). Israel is on the supported-region list. The ToS forbids clinical practice and medical advice use, so keep the app framed as personal wellness tracking. [G6][G7][G8][G10]
4. **API surface.** Use `generateContent` (stable; Google itself says keep it for production). The Interactions API is Beta, stores every request by default (55 days on paid), and had a breaking schema change (legacy removed 2026-06-08). [G14]
5. **Platform.** Cloudflare's own Pages overview tells readers to start new projects on Workers; Pages is not formally deprecated (no notice found). Cron Triggers do NOT exist on Pages. Recommend one Worker with static assets + D1 + cron. The same handler also runs unchanged as a Pages Function (TESTED both). [C9][C10][C23]
6. **Tooling.** The OAuth login on this Mac already has `d1:write`, `pages:write`, `workers_scripts:write`, `workers_kv:write`, `queues:write`. It sees TWO Cloudflare accounts, so every non-interactive wrangler command needs `CLOUDFLARE_ACCOUNT_ID`. Installed wrangler is 4.77.0, latest on npm is 4.143.0: upgrade first. [L1]
7. **CPU budget.** Workers Free gives 10 ms CPU per request. So no PBKDF2/scrypt/argon2 on login. Production Workers also cap PBKDF2 at 100,000 iterations. Use a random long passphrase, an HMAC verifier, and throttling. [C1][C15][L3]
8. **iPhone login.** The installed Home Screen app has its own cookies and storage, separate from Safari, by design. Log in inside the installed app. A server-set cookie with `Max-Age` (180 days) is not hit by the ITP 7-day cap and Home Screen apps are exempt from ITP data removal. Never rely on session cookies (iOS 17.x reports of loss). [W1][W4][W5][W6]
9. **Push.** Web Push works only from the installed app (iOS 16.4+), needs a tap to request permission, and every push must show a notification. A sender in a Worker needs only Web Crypto (TESTED byte-for-byte against the RFC 8291 vector). Cron is UTC only and Israel leaves DST on 2026-10-25, so run every 15 minutes and decide in `Asia/Jerusalem`. [W7][W12][X3][C11][L4]
10. **Later.** Passkeys (Face ID) are the right upgrade: a passphrase alone meets only ASVS Level 1. Choose the final hostname first, because push subscriptions and passkeys are bound to the origin. [O7][W4]

Decisions the owner must make or do (I cannot): (a) enable billing in AI Studio (payment details) and create the key there; (b) pick the Cloudflare account; (c) pick the final hostname; (d) run the 10-minute iPhone test list in section 6, item 3; (e) `npm i -g wrangler@latest`.

---

## 1. Gemini API

### 1.1 Model catalog (docs "last updated" 2026-09-24, per page footer)

| Model ID | Status | Facts |
|---|---|---|
| `gemini-3.8-flash` | **Stable (GA)**, released 2026-09-02 | Most intelligent Flash. In: text, image, video, audio, PDF. Out: text. 1,048,576 in / 65,536 out. Thinking low/medium/high, default medium; `minimal` returns an error. No shutdown date. [G1][G2][G4][G16] |
| `gemini-3.7-flash` | Stable, 2026-08-13 | Same limits and price as 3.8; Google says it stays fully supported. [G2][G3][G4][G16] |
| `gemini-3.6-flash` | Stable, 2026-07-21 | Same price; thinking includes `minimal`. [G3][G4][G15] |
| `gemini-3.5-flash` | Stable, 2026-05-19 | $1.50 in / $9.00 out (dearer than 3.8 promo). [G3][G4] |
| `gemini-3.5-flash-lite` | Stable, 2026-07-21 | Cheapest current model; default thinking `minimal`. [G3][G4][G15] |
| `gemini-3.1-flash-lite` | Stable, **shutdown earliest 2027-05-07**, replacement `gemini-3.5-flash-lite` | [G4] |
| `gemini-3.1-pro-preview` | **Preview** (2026-02-19), paid only, no shutdown date | Best reasoning available. Thinking low/medium/high, default high. Extra endpoint `-customtools`. [G2][G3][G4][G15] |
| `gemini-3-flash-preview` | Preview | Deprecations table names `gemini-3.6-flash` as replacement, no date. [G4] |
| `gemini-2.5-pro`, `-flash`, `-flash-lite` | Not deprecated, but access is limited to users who used them before | Do not build on them. [G1][G4] |
| `gemini-2.0-flash`, `-flash-lite` | Shut down (earliest date was 2026-06-01) | [G1][G4] |
| `gemini-3-pro-preview`, `gemini-3.1-flash-lite-preview` | Shut down | [G1] |

Aliases such as `gemini-flash-latest` are hot-swapped with only 2 weeks email notice: pin exact IDs for a health app. [G1] To confirm the IDs are usable by your key, run once: `curl -H "x-goog-api-key: $KEY" https://generativelanguage.googleapis.com/v1beta/models` [UNVERIFIED, needs a key].

Recommendation: (a) interactive chat, photo analysis, JSON: `gemini-3.8-flash`, `thinkingLevel: LOW` (Google: Gemini 3.8 can spend more tokens by design; lower the level for everyday tasks). (a-cheap) `gemini-3.5-flash-lite` for high-volume simple classification after testing quality on Hebrew food photos. (b) weekly or blood-test synthesis: `gemini-3.1-pro-preview`, or 3.8 Flash at `HIGH`. Judge by your own eval; I did not benchmark quality. [G16]

### 1.2 Feature support

- **Inputs/outputs.** Text, image, video, audio, PDF in; text out (3.8 Flash). Structured outputs, function calling, thinking, caching, code execution, search grounding, URL context supported; Batch, Flex, Priority consumption options. [G2]
- **Images.** Inline base64 `inlineData:{mimeType,data}`: the whole request (text + system instruction + inline bytes) must be <= 20 MB, otherwise use the Files API. PNG, JPEG, WEBP, HEIC, HEIF (the Blob reference also lists GIF and AVIF). Up to 3,600 images per request. Put the text prompt before the image. [G17][G12]
- **Image tokens (Gemini 3).** `unspecified` (default) 1,120 tokens; low 280; medium 560; high 1,120; ultra_high 2,240 (per content item only). In generateContent the per-part field is `mediaResolution:{level:"MEDIA_RESOLUTION_HIGH"}`; global `generationConfig.mediaResolution` is an enum. Per-part shape comes from the reference, not live-tested. [G18][G12]
- **Structured output.** `generationConfig.responseMimeType:"application/json"` + `generationConfig.responseJsonSchema` (JSON Schema, lowercase types). Supported keywords: `$id $defs $ref $anchor type format title description enum items prefixItems minItems maxItems minimum maximum anyOf oneOf properties additionalProperties required`, plus `propertyOrdering`. The reference marks `responseSchema` (OpenAPI style) and `_responseJsonSchema` deprecated in favour of `responseFormat`, and the SDK comment says `responseMimeType` is deprecated in favour of `response_format`; however the official JS SDK still sends `generationConfig.responseJsonSchema` + `responseMimeType` for the Developer API in its current main branch, so I used those. Validate values in code; streamed chunks are partial JSON to concatenate. Structured output combined with tools is a Gemini 3 preview feature. [G12][G19][G23]
- **Function calling.** `tools:[{functionDeclarations:[{name,description,parameters | parametersJsonSchema}]}]` (the two are mutually exclusive). `toolConfig.functionCallingConfig.mode`: `AUTO`, `ANY`, `NONE`, `VALIDATED`, with `allowedFunctionNames`. Gemini 3 issues a unique `id` per functionCall; return it as `functionResponse.id`. Send the model's `content` back verbatim (thought signatures ride on the parts; the official SDK's automatic loop does exactly this and answers as `role:"user"` with `functionResponse` parts). Streamed function calls arrive whole in one chunk. Parallel and compositional calls supported. [G12][G13][G20][G14][G23]
- **Streaming.** `POST .../models/{model}:streamGenerateContent?alt=sse`; each SSE `data:` is a `GenerateContentResponse` JSON. (Official SDK uses exactly this path.) [G12][G23]
- **System instructions.** `systemInstruction:{parts:[{text}]}`, text only. [G12]
- **Context window.** 1,048,576 input / 65,536 output tokens for every model in 1.1 that I opened. [G2]
- **Thinking.** `generationConfig.thinkingConfig.thinkingLevel` enum `MINIMAL|LOW|MEDIUM|HIGH` (uppercase in REST). Support per model in 1.1. Legacy `thinkingBudget` cannot be combined with `thinkingLevel` (400). Thinking tokens are billed as output. Keep temperature/top_p/top_k at defaults for Gemini 3.x. The thinking guide (Interactions wording) says the max-output setting counts thinking tokens and a too-small value truncates output; I assume the same for `maxOutputTokens`. [G12][G15][G21]
- **Other.** Batch (50% off), Flex (`serviceTier`, target 1-15 min latency, best effort, 429/503 possible: only for background jobs), Priority, caching, Search grounding ($14 per 1,000 after 5,000 free per month, shared across 3.x). [G3][G22]

### 1.3 Price (paid tier, USD per 1M tokens, Standard) [G3]

| Model | Input (text/image/video) | Output (incl. thinking) | Cached input |
|---|---|---|---|
| gemini-3.8 / 3.7 / 3.6 Flash | 0.75 through 2026-12-31, then 1.50 | 3.75, then 7.50 | 0.075, then 0.15 (+ storage 0.50, then 1.00 per 1M tokens per hour) |
| gemini-3.5-flash | 1.50 | 9.00 | 0.15 |
| gemini-3.5-flash-lite | 0.30 (also audio) | 2.50 | 0.03 |
| gemini-3.1-flash-lite | 0.25 (audio 0.50) | 1.50 | 0.025 |
| gemini-3.1-pro-preview | 2.00 (<=200k prompt), 4.00 (>200k) | 12.00, 18.00 | 0.20, 0.40 |

Batch and Flex are half of Standard (3.8 Flash promo: 0.375 / 1.875). Image input has no separate rate: 1,120 tokens x $0.75/M = about $0.00084 per photo. Free tier: no charge for the Flash and Flash-Lite models, not available for 3.1 Pro Preview. [G3]

Back-of-envelope (my estimate, not a quote; check `usageMetadata` for real numbers): meal photo call = about 1,700 in + 1,200 out (incl. LOW thinking) = $0.006 promo, $0.012 from 2027. Chat turn with 3k tokens of history and 500 out = $0.004 promo. Five photos plus twenty turns a day = about $3.3 per month promo, about $6.7 from 2027. A Pro-preview weekly report (30k in, 8k out) = about $0.16. The $5 prepay minimum covers 1-2 months.

### 1.4 Rate limits, tiers, billing

- Limits are RPM, TPM (input), RPD, **per project not per key**; RPD resets at midnight Pacific; preview models are more restricted. Per-model free-tier numbers are **not published in the docs**, only in the AI Studio dashboard: `[UNVERIFIED numbers]`. [G5]
- Tiers: Free (active project); **Tier 1** = billing account linked (Free to Tier 1 usually takes effect immediately), monthly cap $250, spend-rate limit $10 per 10 minutes; Tier 2 = paid $100 and 3 days (cap $2,000); Tier 3 = paid $1,000 and 30 days. 429 `RESOURCE_EXHAUSTED` when a spend limit is hit. [G5][G6]
- **Enable paid tier for a personal key** (owner does this): AI Studio > API keys (or Projects) > find the project > "Set up billing" under Billing Tier > pick or create a Cloud Billing account (country, terms, payment method) > prepay minimum $5 (you may be offered Postpay instead). Prepay: max $5,000 per purchase, credits expire after 12 months and are non-refundable except when switching to Postpay, auto-reload and monthly auto-charge limit optional. **When the balance reaches $0 every key in every project on that billing account stops with HTTP 402.** Optional project spend cap: AI Studio > Spend > Monthly spend cap (marked experimental, about 10 minutes latency). [G6]
- **API keys.** Since 2026-05-28 new AI Studio keys are "auth keys" (bound to a service account, restricted to the Gemini API). Unrestricted standard keys are rejected; dormant unrestricted keys blocked since 2026-05-07; leaked keys are blocked. Pass the key in header `x-goog-api-key` (docs and official SDK); never put it in the URL or the browser. IP restriction is impractical from Workers `[UNVERIFIED: egress IPs not documented as fixed]`. [G11][G23]
- Errors: retry 429, 408, 5xx with exponential backoff and jitter; never retry 400, 402, 403. [G21]

### 1.5 Data use, regions, health terms

- **Unpaid** (free quota and AI Studio without billing): Google may use submitted content and responses to provide, improve and develop its products and machine-learning technologies, and human reviewers may read, annotate and process API inputs and outputs (after disconnecting them from account, key and project). The terms tell developers: "Do not submit sensitive, confidential, or personal information to the Unpaid Services." [G7]
- **Paid**: Google does not use prompts (including attached files such as images) or responses to improve its products, and processes them under the Data Processing Addendum with Google as processor. It does log prompts and responses for a limited period, solely for abuse detection and legal disclosures, and they may be stored transiently or cached in any country where Google has facilities (no region pinning in the Developer API). The abuse-monitoring page gives the period: **55 days**, reviewed only by authorised staff on flagged content, not used to train models other than policy-enforcement ones. [G7][G8]
- **What counts as Paid:** the Gemini API counts as a Paid Service only when it is accessed through a Cloud project that has an active billing account; AI Studio access is also Paid if the account has such a project. So use only a billing-linked project's key for anything personal, and never experiment with real data in a free project. [G7]
- **Regions:** Israel is on the supported list. EEA, Switzerland and UK may use only Paid. The list applies where the API is accessed from; a Worker calls from the Cloudflare colo that handles the request, normally near you. If a location-not-supported error ever appears on a trip, add `placement.hostname = "generativelanguage.googleapis.com"` (or smart placement) [UNVERIFIED: exact error text and behaviour]. [G10][C19]
- **Health-related terms.** The terms bar using the services in clinical practice, to provide medical advice, or in any way that is overseen by, or needs clearance from, a medical-device regulator. A disclaimer says not to rely on the services for medical, mental-health, legal, financial or other professional advice. Use is framed as for developers building for professional or business purposes rather than consumer use; 18+ only. I found no HIPAA or BAA language in the Gemini API terms `[UNVERIFIED beyond the pages read]`. Practical implications: keep prompts as tracking and coaching, no diagnosis or treatment claims, redact identifiers (name, ID number, lab letterhead) from blood-test uploads before sending, and let the owner read the terms himself. Not legal advice; Israeli privacy-law obligations for health data are outside this track. [G7]
- **Logging on Google's side for your project.** generateContent does not store requests by default; a per-request `store` field (top-level in the request body per the reference) and an AI Studio project toggle (paid only, default retention 55 days, 7/14/28/55 configurable) control it. Interactions API stores by default (paid 55 days, free 1 day). Do not "share datasets" with Google: it re-applies Unpaid terms. My code sends `store:false`. [G9][G14][G12]

### 1.6 Which API surface

Google presents the Interactions API (`POST /v1beta/interactions`) as the new standard and recommends it for all new projects, yet the same page says it is Beta, that production workloads should stay on generateContent, that Batch API and explicit caching are missing, and its legacy schema was removed 2026-06-08 (new schema opt-in via header `Api-Revision: 2026-05-20`). Its state is server-side by default (`store=true`). [G14] Decision: generateContent, wrapped in one module (`src/gemini.js`) so a later switch touches one file.

| Concept | generateContent (used) | Interactions (beta) |
|---|---|---|
| Endpoint | `/v1beta/models/{m}:generateContent`, `:streamGenerateContent?alt=sse` | `/v1beta/interactions` with `"stream":true` |
| Extra header | none | `Api-Revision: 2026-05-20` |
| Input | `contents:[{role,parts}]` | `input` (string or steps) |
| System | `systemInstruction` | `system_instruction` |
| Thinking | `generationConfig.thinkingConfig.thinkingLevel:"LOW"` | `generation_config.thinking_level:"low"` |
| JSON | `responseMimeType` + `responseJsonSchema` | `response_format:{type:"text",mime_type:"application/json",schema}` |
| Tools | `tools[].functionDeclarations[]`, reply `functionResponse` | `tools[]:{type:"function",...}`, steps `function_call` / `function_result` |
| Storage | off unless `store:true` | on unless `store:false` |

### 1.7 Code: three calls from a Worker (TESTED against a mock that asserts path, header, field names)

`C_code_v1/src/gemini.js` (full file). The mock checks: `x-goog-api-key` present and no `?key=`, `alt=sse` on streaming, `store:false`, `thinkingLevel`, `systemInstruction`, image + schema present, and that the tool loop echoes the model turn (with `thoughtSignature`), the `id`, and `role:"user"` correctly. Real API semantics are not verified.

```js
// Gemini generateContent client for Cloudflare Workers (no Node built-ins).
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
```

Live smoke test the owner should run once a key exists (no Worker needed):
```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" -H 'content-type: application/json' \
  -d '{"contents":[{"parts":[{"text":"ping"}]}],"generationConfig":{"thinkingConfig":{"thinkingLevel":"LOW"}},"store":false}'
```
Keyless probe I ran: `POST .../models/gemini-3.8-flash:generateContent`, `:streamGenerateContent?alt=sse` and `/v1beta/interactions` all return HTTP 403 "unregistered callers" (paths exist; model validity cannot be checked without a key).

---

## 2. Cloudflare platform

### 2.1 Pages vs Workers, and what it means for us

- Pages overview (updated 2026-08-25): opens by asking whether you are sure you want Pages, says Workers covers most Pages use cases with a broader feature set, calls Workers Cloudflare's primary platform for applications, and tells you to start new projects on Workers. [C9]
- No shutdown date or formal deprecation notice was found; the Pages changelog's latest entries are maintenance (2026-08-11 superseded builds, 2026-01-23 file-limit increase). `[UNVERIFIED]` absence of an announcement elsewhere. [C23]
- Compatibility matrix (page updated 2026-09-22). Workers only: **Cron Triggers**, Workers Logs, Logpush, Tail Workers, Queue consumers, Rate Limiting binding, Email Workers, Image Resizing binding, gradual deployments, remote dev, non-root routes, Vite plugin. Pages only: custom domains outside Cloudflare zones, custom branch aliases, file-based `functions/` routing and Pages Plugins (Workers can compile a `functions/` folder with `wrangler pages functions build`). Static assets, D1, KV, R2, secrets, `_headers`, `_redirects`, Smart Placement work on both. [C10]
- Workers with static assets: static requests are free and unlimited; Worker invocations billed like Pages Functions; `assets.run_worker_first` accepts a route array (max 100 entries, `!` exceptions) so only `/api/*` invokes code; workers.dev subdomain available, custom domains need Cloudflare-managed nameservers. [C2][C10][C21]
- **For us:** a private sleep coach needs scheduled push (cron) and logs, both Workers-only. Recommendation: one Worker with static assets, D1 and a cron trigger. Migration from the owner's usual Pages layout is a config change plus one entry file (section 2.5). If the owner insists on Pages: keep `functions/api/[[route]].js` (adapter in `C_code_v1/pages-variant/`, TESTED; note `wrangler pages dev` rejects `-c <other file>` with "Pages does not support custom paths for the Wrangler configuration file", so the Pages project needs its own folder and `wrangler.toml`), add `_routes.json` (`include:["/api/*"]`) so static requests do not invoke Functions (not tested), and create a second tiny cron Worker bound to the same D1 database id (a Worker can bind the same D1) that runs `src/cron.js`. [C17]
- Pages direct-upload gotcha (matches the owner's memory notes): the production branch is set at project creation and can only be changed via API; `pages deploy --branch <other>` is a Preview deployment. [C18]
- Put the app on its own hostname, not a path of the business site (ASVS 3.5.4; cookies are host-only with `__Host-`). [O7]

### 2.2 Limits that matter (single-user app)

| Item | Free | Paid ($5/month minimum) | Source |
|---|---|---|---|
| Worker/Function requests | 100,000/day (Pages Functions share it; resets 00:00 UTC) | 10M/month included | [C1][C2][C4] |
| **CPU time per HTTP request** | **10 ms** | 30 s default, up to 5 min | [C1] |
| CPU per Cron Trigger invocation | 10 ms | 30 s (interval < 1 h), 15 min (>= 1 h) | [C1] |
| Wall clock, HTTP | no limit while client stays connected (streaming fine); `waitUntil` up to 30 s after response | same | [C1] |
| Wall clock, Cron / Queue consumer / DO alarm | 15 min | 15 min | [C1] |
| Memory | 128 MB per isolate | same | [C1] |
| Subrequests per invocation | 50 external; 1,000 to internal services (docs conflict: D1 page says 50 D1 queries on Free) | 10,000 (up to 10M) | [C1][C5] |
| Simultaneous outgoing connections | 6 | 6 | [C1] |
| Request body | 100 MB (Cloudflare plan Free/Pro) | Business 200 MB | [C1] |
| Env vars | 64, 5 KB each | 128 | [C1] |
| Cron Triggers per account | 5 | 250 | [C1] |
| D1 rows read | 5M/day | 25B/month incl., then $0.001/M | [C6] |
| D1 rows written | 100,000/day | 50M/month incl., then $1.00/M | [C6] |
| D1 storage | 5 GB account, 500 MB per DB, 10 DBs | 10 GB per DB, 5 GB incl. then $0.75/GB-month | [C5][C6] |
| D1 row/blob/string size | 2 MB max (do not store photos in D1) | 2 MB | [C5] |
| D1 misc | 100 bound params per query, 100 KB statement, 30 s query max, Time Travel 7 days (Free) / 30 days (Paid) | | [C5] |
| KV | 100,000 reads/day, 1,000 writes/day, 1 GB, value <= 25 MiB, same key 1 write/s | 10M reads and 1M writes per month incl., then $0.50/M and $5/M | [C7] |
| R2 | 10 GB-month, 1M Class A, 10M Class B per month, no egress fee | $0.015/GB-month | [C8] |
| Pages static | 25 MiB per file, 20,000 files (Free), 100 projects per account | | [C3] |
| Queues | 10,000 ops/day, 24 h retention, consumers only in Workers | $0.40/M ops | [C13] |
| Workflows | 10 ms compute per step, 100,000 runs/day (shared), `step.sleep` up to 365 days | unlimited runs | [C13] |

Consequences: photo pipeline must keep Worker CPU tiny on Free (resize to <= 1600 px JPEG in the browser, forward base64 as a string). D1 daily quotas are far above one user's needs. Use R2 (or nothing) for stored images. Add D1 indexes to keep rows-read low. Free plan D1 quotas reset daily at 00:00 UTC. [C6]

### 2.3 Scheduled work

- **Cron Triggers are not available in Pages Functions** (compatibility matrix: Cron Triggers supported on Workers, not on Pages). [C10]
- Pattern A (recommended): the same Worker exports `scheduled(controller, env, ctx)` and `[triggers] crons` in `wrangler.toml`. Cron is **UTC only**; changes take up to 15 minutes to propagate. [C11][C12]
- Pattern B (stay on Pages): separate Worker with cron and its own `wrangler.toml` binding the same D1 id, doing the work directly. Calling the Pages app over HTTP with a shared-secret header works but is unnecessary; service bindings are listed as supported on both platforms but I did not test a Worker calling a Pages project. [C10]
- **Workflows** (durable multi-step, retries, sleeps, cron via `schedules`) and **Queues** (fan-out, consumer must be a Worker) are overkill for one user; keep them as an option for a nightly multi-step Gemini analysis. [C13][C11]
- **Israel DST** (computed with ICU, TESTED): offset changes from UTC+3 to UTC+2 at 2026-10-24T23:00Z (02:00 local on 2026-10-25) and back in late March 2027. A fixed UTC cron would drift one hour, so `src/cron.js` runs every 15 minutes and compares `Intl.DateTimeFormat` time in `Asia/Jerusalem` with `PUSH_SLOTS`. [L4]
- Local test: on wrangler 4.77.0 use `wrangler dev --test-scheduled` and `GET /__scheduled` (TESTED). Current docs list `/cdn-cgi/local/scheduled` for newer wrangler. [C12][L2]

### 2.4 Web Crypto in Workers (TESTED in workerd)

- Supported: HMAC, AES-GCM/CBC/CTR/KW, ECDSA and ECDH P-256, HKDF, PBKDF2, RSA variants, Ed25519 and X25519, SHA-1/256/384/512, plus non-standard `crypto.subtle.timingSafeEqual(a, b)`. [C14]
- `timingSafeEqual` **throws `TypeError: Input buffers must have the same byte length.`** on unequal lengths (TESTED), so compare fixed-length digests or guard the length first.
- **PBKDF2 cap:** production Workers reject more than 100,000 iterations; local `wrangler dev` does not enforce it (TESTED: 600,000 ran locally), which hides the failure until deploy. The upstream issue (workerd #1346) was still open on 2026-09-20 with a report in January 2026 of the error at 210,000. OWASP wants PBKDF2-HMAC-SHA256 >= 600,000 or Argon2id (19 MiB, 2 iterations, 1 lane), so a high-work-factor KDF is not achievable in a Worker. Local measurement (Node, Apple silicon): 100k iterations = about 15 ms, 600k = about 91 ms, one HMAC = 0.02 ms: 100k PBKDF2 alone would exceed the Free 10 ms CPU limit. [C15][O4][L3]
- App-layer field encryption (AES-256-GCM, fresh 12-byte IV, AAD bound to the row): `src/seal.js`, TESTED round-trip, wrong-AAD and tamper rejected. D1 is already encrypted at rest (AES-256-GCM, Cloudflare-managed keys, SOC 2 and ISO 27001), so field encryption only helps against DB dumps and logs, not against a compromise of the Worker itself where `DATA_KEY` also lives. [C20]

```js
// src/seal.js  (DATA_KEY = base64url of 32 random bytes, stored as a secret)
const enc = new TextEncoder(), dec = new TextDecoder();
const b64u = {
  enc: (b) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
};
const key = (env) => crypto.subtle.importKey('raw', b64u.dec(env.DATA_KEY), 'AES-GCM', false, ['encrypt', 'decrypt']);
export async function seal(env, text, aad = '') {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc.encode(aad) }, await key(env), enc.encode(text));
  return `v1.${b64u.enc(iv)}.${b64u.enc(ct)}`;
}
export async function open(env, sealed, aad = '') {
  const [v, iv, ct] = sealed.split('.');
  if (v !== 'v1') throw new Error('unknown format');
  return dec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64u.dec(iv), additionalData: enc.encode(aad) }, await key(env), b64u.dec(ct)));
}
```

### 2.5 wrangler with OAuth login (no API token)

Evidence from this Mac (wrangler 4.77.0), all read-only: [L1]
- `wrangler whoami` shows an OAuth token with scopes: user (read), offline_access, account (read), workers (write), workers_kv (write), workers_routes (write), workers_scripts (write), workers_tail (read), **d1 (write)**, **pages (write)**, zone (read), ssl_certs (write), ai (write), ai-search, **queues (write)**, pipelines, secrets_store, containers, cloudchamber, connectivity. `wrangler login --scopes-list` prints the same set. So `d1 create`, `d1 migrations apply`, `secret put`, `pages secret put`, `pages deploy`, `deploy` are inside the granted scopes. The refresh scope `offline_access` is present. I did not execute any create, put or deploy.
- `wrangler d1 list` (5 databases), `wrangler r2 bucket list` (R2 enabled, several buckets) and `wrangler pages project list` (9 projects) all worked through OAuth.
- **Two accounts are visible**; without `CLOUDFLARE_ACCOUNT_ID` (or `account_id` in the config) non-interactive commands fail with "More than one account available but unable to select one in non-interactive mode". Run `wrangler whoami` to see names and ids and choose.
- Version: installed 4.77.0; npm `latest` is 4.143.0. With 4.77.0 the local runtime warns it only supports compatibility dates up to 2026-03-17. Upgrade: `npm i -g wrangler@latest`.

Commands (syntax verified with `--help` on 4.77.0 and the docs; write commands not executed) [C16][C18][C21]:
```bash
export CLOUDFLARE_ACCOUNT_ID=<id from wrangler whoami>
wrangler d1 create sleep-coach --location eeur --binding DB --update-config   # prints database_id; also --jurisdiction eu
wrangler d1 migrations create sleep-coach add_food_log      # writes migrations/0001_add_food_log.sql
wrangler d1 migrations list sleep-coach --remote
wrangler d1 migrations apply sleep-coach --remote           # WITHOUT a flag it runs LOCAL (TESTED: "Resource location: local")
wrangler d1 execute sleep-coach --remote --command "UPDATE auth_state SET fails=0, locked_until=0 WHERE id=1"   # unlock recovery
# secrets
wrangler secret put GEMINI_API_KEY            # Worker; creates a version and deploys immediately
wrangler secret bulk secrets.json             # or stdin; or: wrangler deploy --secrets-file .env.production
wrangler pages secret put GEMINI_API_KEY --project-name sleep-coach   # Pages; set before the deploy that uses it
# deploy
wrangler deploy                                # Worker + static assets + cron
wrangler pages project create sleep-coach --production-branch main
wrangler pages deploy ./public --project-name sleep-coach --branch main   # branch must equal the production branch
```
D1 location hints available: `weur eeur apac oc wnam enam` (no Middle East value); `--jurisdiction`: `eu`, `fedramp` (docs also list `us`); when a jurisdiction is set the hint is ignored. [C16]

Pages `wrangler.toml` (2026 syntax; source of truth once used; `pages_build_output_dir` required; only `env.production` and `env.preview` exist): [C17]
```toml
name = "sleep-coach"
pages_build_output_dir = "./public"
compatibility_date = "2026-09-29"
[[d1_databases]]
binding = "DB"
database_name = "sleep-coach"
database_id = "<uuid>"
```
Recommended Workers `wrangler.toml` (validated with `wrangler deploy --dry-run`: bundle 19 KiB, gzip 6.3 KiB; not deployed) is `C_code_v1/wrangler.toml`. The `[secrets] required = [...]` block makes deploy fail when a secret is missing but 4.77.0 warns that the secrets block is experimental. `_headers` applies only to static assets, not to Worker or Function responses, which is why `secure()` sets headers in code. [C22]

---

## 3. PWA on iPhone (and Android in a few lines)

### 3.1 Add to Home Screen by iOS version

| iOS | Behaviour | Source |
|---|---|---|
| 16.4 to 25 | A site becomes a Home Screen web app only with a manifest `display: standalone` or `fullscreen` (or the legacy `apple-mobile-web-app-capable` meta); otherwise it is a bookmark opening in the default browser. Third-party browsers can add to Home Screen from 16.4. | [W7][W10] |
| 26 and 27 | By default every site added to the Home Screen opens as a web app; the user may switch off "Open as Web App" at add time; no installability requirements remain. Safari 27.0 (released 2026-09-17) notes list no change to storage, cookie, push or web-app behaviour (only Cookie Store `maxAge`). | [W10][W11] |

Also: installation is manual (Share > Add to Home Screen; there is no `beforeinstallprompt` on iOS). Removing the icon deletes the PWA and its data. Each install is separate. Links outside the manifest scope open in Safari View Controller. Set `name`, `short_name`, `id`, `start_url`, `scope`, `display`, icons, and an `apple-touch-icon` (it takes precedence over manifest icons). [M3][W4][W7]

```json
{ "name": "Sleep Coach", "short_name": "Sleep", "id": "/", "start_url": "/", "scope": "/", "display": "standalone",
  "background_color": "#0b1020", "theme_color": "#0b1020",
  "icons": [{ "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" }, { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }] }
```

### 3.2 Cookies, storage, persistence of the login

- **No sharing with Safari.** Apple (WWDC23) states that Home Screen web apps keep their cookies and storage separate from the browser. A WebKit engineer answered the long-standing bug (comment dated 2022-02-01) that this is by design: Home Screen apps are isolated entities with no shared state with the browser. WebKit's ITP page likewise says Home Screen web app data is isolated from Safari. macOS Dock web apps get a one-time cookie copy when added; no such statement exists for iOS. **So a login in Safari does not carry into the installed app, and vice versa.** Design for a first-launch login inside the installed app. [W4][W5][W1][W13]
- **ITP 7-day cap.** ITP deletes cookies created in JavaScript and all script-writable storage (localStorage, IndexedDB, service worker registrations, Cache API) after 7 days of Safari use without user interaction with the site. **Server-set (`Set-Cookie`) cookies are exempt**, except third-party CNAME or IP cloaked responses (a same-origin first-party cookie is "No cap" in WebKit's table). **Home Screen web apps are exempt** from the cap and have their own days-of-use counter; WebKit says deleting their data would be a serious bug. [W1][W2][M2]
- **Chrome/Chromium** caps cookie lifetime at 400 days (M104), so 180 days is safe. [X1]
- **Session cookies are unreliable in the installed app.** WebKit bug 272325 (iOS 17.2 to 17.4.1, still "NEW" when I read it): session cookies (no `Max-Age`) were reset to earlier values or lost on app restart; the reporter could not reproduce with persistent cookies. **Always set `Max-Age`.** OWASP prefers non-persistent session cookies; a 180-day sliding cookie is a deliberate, documented deviation (ASVS 7.1.1 requires documenting the justification). [W6][O2][O7]
- **Cookies are not subject to storage quota or eviction** (WebKit storage policy). Ways the login can still be lost: user deletes the icon or clears website data, restore to a new phone, hostname change, unknown iOS bugs. Mitigations: `/api/me` check on launch and a one-tap re-login with the password manager, plus a passkey later. Password-manager autofill inside the installed app is `[UNVERIFIED]`. [W3][M3]
- Cookie recipe used in the code: `__Host-sc=<payload>.<hmac>; Max-Age=15552000; Path=/; Secure; HttpOnly; SameSite=Strict`, set only from the server. Safari 26.2 validates `__Host-` prefixes strictly (must be Secure, no Domain, Path=/), which this satisfies. [W10][O2]

### 3.3 Storage, eviction, service worker

- Quota (iOS 17+ / Safari 17): per-origin up to 60% of disk for browser apps and **the same 60% for a Home Screen web app**; 15% for other WebKit apps; overall 80% / 20%. Cache API, IndexedDB, localStorage, service workers count; cookies and HTTP cache do not. Eviction: LRU when over the overall quota, under storage pressure, or via ITP (not for Home Screen apps). `navigator.storage.persist()` is granted by heuristics such as being a Home Screen app. [W3][M2]
- Service worker registrations are among the script-writable data ITP removes for un-visited sites in Safari; a Declarative Push subscription survives that because it does not depend on a service worker. [W1][W9]
- The app shell can be precached without a practical size cap at this scale; still keep photos out of the Cache API.

### 3.4 Camera capture

`<input type="file" accept="image/*" capture="environment">`. `capture` accepts `user` or `environment`; browser-compat data: Safari iOS since 10, Chrome Android since 25. On desktop it degrades to a file picker. MDN: many mobile devices also offer the camera with plain `accept="image/*"`. iOS behaviour inside the standalone app (does it open the camera directly, does it offer the library), and whether iOS hands over HEIC or JPEG, are `[UNVERIFIED]`: test on the phone. Gemini accepts HEIC and HEIF directly, but resize in the browser anyway (Workers Free CPU). Snippet, UNTESTED on device (verify EXIF rotation): [M1][X6][G17]
```js
async function shrink(file, max = 1600, q = 0.85) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = Object.assign(document.createElement('canvas'), { width: Math.round(bmp.width * s), height: Math.round(bmp.height * s) });
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', q));
  const url = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
  return url.split(',')[1]; // base64 for {image, mime:'image/jpeg'} to /api/meal
}
```

### 3.5 Web Push and Badging

Requirements (iOS): [W7][W8][W12][W9]
- iOS/iPadOS 16.4+, **Home Screen web app only** (in Safari tabs the `Notification` interface is undefined, per MDN compat data). Permission must be requested from a direct user gesture (tap) and `pushManager.subscribe` called from that handler. `userVisibleOnly: true` is mandatory and **every push must produce a visible notification**; otherwise Safari revokes the subscription (silent-push penalty). No Apple Developer Program needed; delivery goes through APNs (`*.push.apple.com`, allow it if you restrict egress). Notifications honour Focus. [W7][W8][W12]
- **Declarative Web Push** (iOS/iPadOS 18.4+, Home Screen apps): send JSON with `"web_push": 8030` and a `notification` object (`title`, `body`, `navigate` required for click, `lang`, `dir`, `silent`, `app_badge`); no service worker required, and no silent-push penalty. Same JSON also works with a classic service worker handler, so send this one format everywhere. [W9]
- **Apple push service rules** (RFC 8030/8291/8292 profile): `TTL` header is required (else `BadTtl`); `Authorization: vapid t=<JWT>, k=<public key>` where the key must equal the `applicationServerKey` used in `subscribe`; JWT `aud` = push service origin, `exp` <= 24 h, `sub` = `mailto:` or `https:` URL (else `BadJwtToken`); do not mint a new JWT more than about once per hour; `Content-Encoding: aes128gcm`; optional `Topic` (<= 32 URL-safe chars) and `Urgency`; payload limit 4 KB (413 `PayloadTooLarge`); 201 success, 410 = expired subscription (delete it), 403 = auth error, 429 too many. [W12][X3][X4]
- **Minimum sender in a Worker** = Web Crypto only: generate an ephemeral ECDH P-256 key, ECDH with the subscription's `p256dh`, HKDF-SHA-256 twice (RFC 8291 section 3.4), AES-128-GCM with a single record and padding delimiter 0x02, header `salt(16) || rs=4096 (4 bytes) || idlen(1) || as_public(65)`; VAPID JWT signed with ECDSA P-256 (raw r||s = JWS ES256). **TESTED:** reproduces the RFC 8291 section 5 body byte-for-byte inside workerd; a body produced by `sendPush` decrypts with an independent `node:crypto` implementation (Hebrew payload intact); JWT verifies with the advertised public key; cron -> D1 -> push -> HTTP 410 cleanup works end-to-end against a mock push endpoint. Not tested against real Apple servers. [X3][X4][L2]

```js
// src/push.js  (secrets: VAPID_PRIVATE_JWK; vars: VAPID_PUBLIC, VAPID_SUBJECT="mailto:..."). Generate keys once: node gen-vapid.mjs
const enc = new TextEncoder();
const b64u = {
  enc: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
};
const cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
const hkdf = async (salt, ikm, info, len) => new Uint8Array(await crypto.subtle.deriveBits(
  { name: 'HKDF', hash: 'SHA-256', salt, info }, await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']), len * 8));

// sub = { endpoint, keys: { p256dh, auth } } exactly as returned by PushSubscription.toJSON(). opts only for RFC test vectors.
export async function encrypt(sub, payload, opts = {}) {
  const uaPub = b64u.dec(sub.keys.p256dh), authSecret = b64u.dec(sub.keys.auth);
  const as = opts.asKeys || await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', as.publicKey));
  const ua = await crypto.subtle.importKey('raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: ua }, as.privateKey, 256));
  const salt = opts.salt || crypto.getRandomValues(new Uint8Array(16));
  const ikm = await hkdf(authSecret, ecdh, cat(enc.encode('WebPush: info\0'), uaPub, asPub), 32);
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, cat(payload, new Uint8Array([2]))));
  return cat(salt, new Uint8Array([0, 0, 0x10, 0]), new Uint8Array([asPub.length]), asPub, ct); // rs=4096, single record
}

const jwtCache = new Map(); // Apple: do not mint a new JWT more than about once per hour
async function vapid(env, endpoint) {
  const aud = new URL(endpoint).origin, t = Math.floor(Date.now() / 1000);
  let e = jwtCache.get(aud);
  if (!e || e.exp - t < 3600) {
    const exp = t + 12 * 3600; // must be <= 24h
    const head = b64u.enc(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
    const body = b64u.enc(enc.encode(JSON.stringify({ aud, exp, sub: env.VAPID_SUBJECT }))); // sub must be mailto: or https: (Apple)
    const key = await crypto.subtle.importKey('jwk', JSON.parse(env.VAPID_PRIVATE_JWK), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(`${head}.${body}`)); // r||s = JWS ES256
    e = { exp, jwt: `${head}.${body}.${b64u.enc(sig)}` };
    jwtCache.set(aud, e);
  }
  return `vapid t=${e.jwt}, k=${env.VAPID_PUBLIC}`;
}

export async function sendPush(env, sub, message, { ttl = 3600, urgency = 'normal', topic } = {}) {
  const body = await encrypt(sub, enc.encode(typeof message === 'string' ? message : JSON.stringify(message)));
  const res = await fetch(sub.endpoint, {
    method: 'POST', body,
    headers: { 'content-encoding': 'aes128gcm', 'content-type': 'application/octet-stream', ttl: String(ttl), urgency,
      authorization: await vapid(env, sub.endpoint), ...(topic && { topic }) },
  });
  return res.status; // 201 ok; 404/410 = subscription gone, delete it; 403 = bad JWT/key; 413 = > 4 KB
}
export { b64u };
```

```js
// src/cron.js  (wrangler.toml: [triggers] crons = ["*/15 * * * *"], vars PUSH_SLOTS="21:30,07:30")
import { sendPush } from './push.js';
const hhmm = (ms) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(ms));
export async function scheduled(controller, env) {
  const slots = (env.PUSH_SLOTS || '21:30').split(','); // "*" = every run (tests)
  if (!slots.includes('*') && !slots.includes(hhmm(controller.scheduledTime))) return;
  const { results } = await env.DB.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions').all();
  for (const r of results) {
    const status = await sendPush(env, { endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } },
      { web_push: 8030, notification: { title: 'זמן להתכונן לשינה', body: 'שעה עד שעת השינה', navigate: `${env.APP_URL}/` } }, { ttl: 3600, topic: 'bedtime' });
    if (status === 404 || status === 410) await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?1').bind(r.endpoint).run();
  }
}
```

Client side, UNTESTED on device (subscription must be created inside the tap handler; store `sub.toJSON()` in D1 table `push_subscriptions(endpoint, p256dh, auth)`):
```js
// in a click handler, installed app only
const reg = await navigator.serviceWorker.register('/sw.js');
if (await Notification.requestPermission() === 'granted') {
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToBytes(VAPID_PUBLIC) });
  const j = sub.toJSON();
  await fetch('/api/push/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth }) });
}
// sw.js (works with declarative and classic delivery; always shows a notification)
self.addEventListener('push', (e) => {
  const n = e.data?.json()?.notification ?? { title: 'Sleep Coach' };
  e.waitUntil(self.registration.showNotification(n.title, { body: n.body, lang: n.lang, dir: n.dir, data: { url: n.navigate || '/' } })
    .then(() => n.app_badge && navigator.setAppBadge?.(Number(n.app_badge))));
});
self.addEventListener('notificationclick', (e) => { e.notification.close(); e.waitUntil(clients.openWindow(e.notification.data.url)); });
```
The `/api/push/subscribe` route is not in `app.js` (a 10-line insert into `push_subscriptions`).

**Badging API.** `navigator.setAppBadge(n)` / `clearAppBadge()` in Home Screen apps from iOS 16.4; works in the foreground and while handling push events, before or after permission; the badge appears once notification permission is granted. Chrome Android: `setAppBadge` not supported per compat data. [W7][X6]

### 3.6 Android / Chrome equivalents

Install via the browser menu or `beforeinstallprompt`; cookie lifetime cap 400 days; `capture` since Chrome Android 25; Push API since Chrome 42 with no Apple-style installed-only rule `[UNVERIFIED official statement on tabs vs installed]`; WebAuthn since 70; whether an installed PWA shares the browser cookie jar on Android `[UNVERIFIED]`; on iOS it does not. [M3][X1][X6]

### 3.7 Passkeys / WebAuthn in iOS standalone PWAs

- Apple's WWDC23 web-apps session recommends passkeys for web apps; iOS Safari exposes `PublicKeyCredential`. A WebKit bug from 2025 (iOS 18, still NEW) shows Face ID WebAuthn prompts working inside a Home Screen web app (and an edge case where a pending prompt can surface in another app after backgrounding), so it works but has rough edges. There is no dedicated official support statement for standalone mode: `[UNVERIFIED]`, test on the phone. Safari 26.4 added the WebAuthn PRF extension. [W4][W14][X6][W10]
- Design for later: RP ID = final hostname (fixed forever), credentials `(id, public key, sign counter)` in D1, challenges in D1 with 5-minute TTL, login by passphrase first then "add this iPhone", then allow passkey-only. `@simplewebauthn/server` 14.0.3 (published 2026-09-25) states it targets Cloudflare Workers among compatible runtimes. Passkeys are not tied to the cookie jar, so they also fix the Safari-versus-installed-app login split. [X5]

---

## 4. Secure single-password login (recommended design, tested)

### 4.1 Design

1. Secrets (never in git, never in D1): `SESSION_SECRET` (32+ random bytes), `LOGIN_PEPPER` (32+ random bytes), `PASS_VERIFIER` = `base64url(HMAC-SHA256(LOGIN_PEPPER, "login:" + passphrase))` computed offline by `make-verifier.mjs`, so the plaintext passphrase is never uploaded. The passphrase is generated by the password manager: >= 16 characters (NIST/OWASP: under 15 is weak without MFA), any Unicode, paste allowed, **not normalized** (ASVS 6.2.8: verify exactly as received), maximum 256 accepted before any hashing (OWASP: cap input to avoid DoS). Because it is high-entropy, a fast HMAC verifier is acceptable; OWASP's KDF rules target low-entropy human passwords and are unreachable in Workers anyway. [O1][O4][O7][C15]
2. **Constant-time compare** with `crypto.subtle.timingSafeEqual` on two 32-byte digests, length guarded. Cookie signature checked the same way. [C14][O1]
3. **Throttling with D1** (single row, counted per account, not per IP): the attempt is counted FIRST by one atomic `UPDATE ... WHERE locked_until <= now`; 5 free tries, then 30 s, 60 s, 120 s ... capped at 900 s; success resets. Locked attempts get 429 with `Retry-After` and never reach the compare. TESTED: schedule 30/60/.../900 s and cap at high counts. This follows OWASP's account-based counter and exponential lockout; the accepted trade-off is that an attacker can keep new logins locked for up to 15 minutes at a time. That does not log out the owner (existing cookies keep working) and recovery is one `wrangler d1 execute` (section 2.5). Generic error text for every failure. [O1][O7]
4. **Session cookie**: `__Host-sc`, `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=15552000` (180 d), no `Domain`, set by `Set-Cookie` only. Token = `base64url({v, iat, ts}) . base64url(HMAC-SHA256(SESSION_SECRET, "sc1." + payload))`; the signature is 256 bits, and a new token is minted on every login. [O2][O7]
5. **Sliding expiry with a hard cap**: `ts` is refreshed (new `Set-Cookie`) when older than 24 h; rejected if `now - ts > 180 d` (idle) or `now - iat > 365 d` (absolute). TESTED both bounds and the refresh.
6. **Version field for global logout**: `v` must equal `auth_state.session_version` in D1; `POST /api/logout-all` increments it, so every stolen or old cookie dies on its next request (one of the patterns ASVS 7.4.1 lists: reject tokens issued before a per-user cutoff). TESTED.
7. **CSRF**: every state-changing request must pass: `Sec-Fetch-Site` in {same-origin, none} when present; `Origin` equal to own origin when present; `Content-Type: application/json` (so form posts and `text/plain` simple requests are refused); plus SameSite=Strict. Login uses the same check (login CSRF). API responses are `no-store`; if they were ever made cacheable they would need `Vary: Sec-Fetch-Site, Origin`. TESTED cross-site, foreign Origin, text/plain. [O3][O7]
8. **Headers**: static shell via `public/_headers`, API via `secure()`: `Strict-Transport-Security: max-age=63072000; includeSubDomains` (no `preload` flag; the whole `.dev` TLD, which covers `*.workers.dev` and `*.pages.dev`, is force-HTTPS with subdomains in Chromium's HSTS preload list, Safari's list `[UNVERIFIED]`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, CSP `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self'; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'` (so no inline scripts or styles; the Gemini key never reaches the browser, so `generativelanguage.googleapis.com` is not allowed in `connect-src`), `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `Permissions-Policy: camera=(self), microphone=(), geolocation=()` (I kept camera for `self` because whether `<input capture>` is affected by the policy is `[UNVERIFIED]`), `Cache-Control: no-store` on API. [O5][O6][O7]
9. **Indexing**: `X-Robots-Tag: noindex, nofollow, noarchive` on everything and a `<meta name="robots">`. **Do not add a blanket `robots.txt Disallow: /`**: Google states a page blocked by robots.txt never has its `noindex` seen and can still appear in results if linked. Auth is the real control; do not link the URL anywhere public. [O5][X2]
10. **Logging**: never log passphrases, cookies or Gemini keys; log lockout events (OWASP: review lockouts). Workers Logs is included on Free and Paid. [O1][C2]

### 4.2 ASVS 5.0 mapping (github.com/OWASP/ASVS 5.0)

| ASVS | Status |
|---|---|
| 3.3.1 Secure, 3.3.3 `__Host-`, 3.3.4 HttpOnly and token only via Set-Cookie, 3.3.2 SameSite by purpose | met |
| 3.4.1 HSTS >= 1 year (+ subdomains L2), 3.4.3 CSP with `object-src 'none'` and `base-uri 'none'`, 3.4.4 nosniff, 3.4.5 Referrer-Policy, 3.4.6 `frame-ancestors`, 3.4.8 COOP | met (3.4.7 CSP report endpoint not done) |
| 3.5.1 to 3.5.3 CSRF (Sec-Fetch, Origin, non-simple requests, POST for actions) | met |
| 6.1.1 / 6.3.1 rate limiting, anti-automation, no malicious lockout (documented) | met, lockout DoS bounded to 15 min and does not affect live sessions |
| 6.2.1 (>= 8, 15 recommended), 6.2.5 any characters, 6.2.7 paste and managers, 6.2.8 verify as received, 6.2.9 >= 64 chars | met |
| **6.3.3 MFA or combination of single-factor mechanisms (L2)** | **not met** with a passphrase alone: add passkey (Face ID) |
| 6.3.5 notify on suspicious attempts (L2) | not done; optional push to the owner on lockout |
| 7.1.1, 7.3.1, 7.3.2 documented idle and absolute lifetime | 180 d idle / 365 d absolute, deviation from NIST/OWASP short timeouts documented above |
| 7.2.4 new token on authentication, 7.4.1 revocation for self-contained tokens, 7.4.5 terminate all sessions | met (version field, logout-all) |

### 4.3 Code (TESTED in workerd with local D1)

Files in `C_code_v1/src/`: `auth.js` (below, full), `app.js` (router), `index.js`, `gemini.js`, `push.js`, `seal.js`, `cron.js`. Entry points: Workers `export default { fetch: handle, scheduled }` (`src/index.js`); Pages `export const onRequest = ({request, env}) => handle(request, env)` (`pages-variant/functions/api/[[route]].js`).

```js
// src/auth.js  Single-user passphrase login for Workers. Secrets: SESSION_SECRET, LOGIN_PEPPER, PASS_VERIFIER.
// PASS_VERIFIER = base64url(HMAC-SHA256(LOGIN_PEPPER, 'login:' + passphrase)), computed offline (ASVS 6.2.8: no normalization).
// D1: auth_state(id=1, session_version, fails, locked_until).
const enc = new TextEncoder(), dec = new TextDecoder();
const COOKIE = '__Host-sc';
const DAY = 86400, IDLE = 180 * DAY, ABS = 365 * DAY, REFRESH_AFTER = DAY;

const b64u = {
  enc: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
};
const hmac = async (secret, msg) => {
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
};
// timingSafeEqual is a Workers extension; both inputs must have equal length (digests always do).
const same = (a, b) => a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
const now = () => Math.floor(Date.now() / 1000);
const json = (o, status = 200, h = {}) =>
  new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...h } });
const cookieHeader = (token, maxAge = IDLE) =>
  `${COOKIE}=${token}; Max-Age=${maxAge}; Path=/; Secure; HttpOnly; SameSite=Strict`;
const getCookie = (req, name) =>
  (req.headers.get('cookie') || '').split(/;\s*/).map((c) => c.split(/=(.*)/s)).find(([k]) => k === name)?.[1];

// CSRF for a same-origin JSON API: Fetch Metadata + Origin + JSON-only content type (OWASP CSRF cheat sheet).
export function csrfOk(req) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;
  const site = req.headers.get('sec-fetch-site');
  if (site && !['same-origin', 'none'].includes(site)) return false;
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return false;
  return (req.headers.get('content-type') || '').startsWith('application/json');
}

async function mint(env, v, iat, ts = iat) {
  const p = b64u.enc(enc.encode(JSON.stringify({ v, iat, ts })));
  return `${p}.${b64u.enc(await hmac(env.SESSION_SECRET, 'sc1.' + p))}`;
}

// Returns null (not logged in) or { refresh: Set-Cookie value | null } (sliding expiry).
export async function session(req, env) {
  const tok = getCookie(req, COOKIE);
  const [p, s] = (tok || '').split('.');
  if (!p || !s) return null;
  let d;
  try {
    if (!same(await hmac(env.SESSION_SECRET, 'sc1.' + p), b64u.dec(s))) return null;
    d = JSON.parse(dec.decode(b64u.dec(p)));
  } catch { return null; }
  const st = await env.DB.prepare('SELECT session_version AS v FROM auth_state WHERE id = 1').first();
  const t = now();
  if (!st || d.v !== st.v || t - d.iat > ABS || t - d.ts > IDLE) return null;
  return { refresh: t - d.ts > REFRESH_AFTER ? cookieHeader(await mint(env, d.v, d.iat, t)) : null };
}

export async function login(req, env) {
  if (!csrfOk(req)) return json({ error: 'forbidden' }, 403);
  const body = await req.json().catch(() => null);
  const pass = typeof body?.passphrase === 'string' ? body.passphrase : '';
  if (!pass || pass.length > 256) return json({ error: 'invalid' }, 400);
  const t = now();
  // Count the attempt FIRST, atomically, and only if not locked: 5 free tries, then 30s, 60s, ... cap 900s.
  const [upd, cur] = await env.DB.batch([
    env.DB.prepare(
      `UPDATE auth_state SET fails = fails + 1,
         locked_until = CASE WHEN fails + 1 >= 5 THEN ?1 + MIN(900, 30 * (1 << MIN(fails + 1 - 5, 5))) ELSE 0 END
       WHERE id = 1 AND locked_until <= ?1`).bind(t),
    env.DB.prepare('SELECT session_version AS v, locked_until FROM auth_state WHERE id = 1'),
  ]);
  if (!upd.meta.changes) { // still locked
    const wait = Math.max(1, (cur.results[0]?.locked_until ?? t) - t);
    return json({ error: 'locked', retry_after: wait }, 429, { 'retry-after': String(wait) });
  }
  const row = cur.results[0];
  const ok = same(await hmac(env.LOGIN_PEPPER, 'login:' + pass), b64u.dec(env.PASS_VERIFIER));
  if (!ok) return json({ error: 'invalid_credentials' }, 401); // generic message, same shape as any failure
  await env.DB.prepare('UPDATE auth_state SET fails = 0, locked_until = 0 WHERE id = 1').run(); // forgive on success
  return json({ ok: true }, 200, { 'set-cookie': cookieHeader(await mint(env, row.v, t)) });
}

export const logout = () => json({ ok: true }, 200, { 'set-cookie': cookieHeader('', 0) });
export async function logoutAll(env) { // bumps the version: every existing cookie dies on next request
  await env.DB.prepare('UPDATE auth_state SET session_version = session_version + 1 WHERE id = 1').run();
  return logout();
}

// Apply to every Worker-generated response (static assets get the same set from a _headers file).
export function secure(res, extra = {}) {
  const h = new Headers(res.headers);
  h.set('x-content-type-options', 'nosniff');
  h.set('referrer-policy', 'no-referrer');
  h.set('x-robots-tag', 'noindex, nofollow, noarchive');
  h.set('cross-origin-opener-policy', 'same-origin');
  h.set('cross-origin-resource-policy', 'same-origin');
  h.set('permissions-policy', 'camera=(self), microphone=(), geolocation=()');
  h.set('strict-transport-security', 'max-age=63072000; includeSubDomains');
  for (const [k, v] of Object.entries(extra)) h.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}
export { json };
```

```js
// src/app.js  router shared by Workers and Pages
import { login, logout, logoutAll, session, csrfOk, secure, json } from './auth.js';
import { chatStream, analyzeMeal, coachWithTools } from './gemini.js';
const SYSTEM = 'You are a concise sleep coach. Reply in Hebrew.';
async function route(request, env) {
  const { pathname } = new URL(request.url);
  if (pathname === '/api/login' && request.method === 'POST') return login(request, env);
  if (pathname === '/api/logout' && request.method === 'POST') return csrfOk(request) ? logout() : json({ error: 'forbidden' }, 403);
  const s = await session(request, env); // everything below needs a valid session
  if (!s) return json({ error: 'unauthenticated' }, 401);
  if (!csrfOk(request)) return json({ error: 'forbidden' }, 403);
  let res;
  if (pathname === '/api/me') res = json({ ok: true });
  else if (pathname === '/api/logout-all' && request.method === 'POST') res = await logoutAll(env);
  else if (pathname === '/api/chat' && request.method === 'POST') {
    const { messages } = await request.json();
    res = await chatStream(env, messages, SYSTEM, request.signal);
  } else if (pathname === '/api/meal' && request.method === 'POST') {
    const { image, mime } = await request.json();
    res = json(await analyzeMeal(env, image, mime));
  } else if (pathname === '/api/coach' && request.method === 'POST') {
    const { text } = await request.json();
    const exec = { get_recent_sleep: async ({ nights }) => ({ nights, avg_hours: 6.9, note: 'stub' }) };
    res = json(await coachWithTools(env, [{ role: 'user', parts: [{ text }] }], SYSTEM, exec));
  } else res = json({ error: 'not_found' }, 404);
  if (s.refresh) res.headers.append('set-cookie', s.refresh); // sliding expiry
  return res;
}
export async function handle(request, env) {
  try { return secure(await route(request, env), { 'cache-control': 'no-store' }); }
  catch (e) { console.error(e); return secure(json({ error: 'server' }, 500)); }
}
```

```sql
-- migrations/0001_init.sql
CREATE TABLE IF NOT EXISTS auth_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  session_version INTEGER NOT NULL DEFAULT 1,
  fails INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO auth_state (id) VALUES (1);
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY, p256dh TEXT NOT NULL, auth TEXT NOT NULL, created_at INTEGER NOT NULL
);
```

Static shell headers, `public/_headers`:
```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Robots-Tag: noindex, nofollow, noarchive
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self'; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'
  Permissions-Policy: camera=(self), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
```
Add `Strict-Transport-Security: max-age=63072000; includeSubDomains` there too.

### 4.4 Known gaps and risks

Single factor (passkey planned); lockout can be triggered by anyone who finds the URL; 180-day cookie exceeds OWASP's usual session lifetimes; a Worker compromise exposes all secrets at once; the D1 read for `session_version` runs on every API call (cheap, 1 row); no per-device session list (only "log out everywhere").

---

## 5. Verification log

| What | Result |
|---|---|
| `test.mjs` (workerd + local D1 + mock Gemini), 30 checks: RFC 8291 vector, `_headers` on static shell, X-Robots-Tag/HSTS on API, 401 without cookie, 5 wrong then 429 with Retry-After, 256-char cap, cookie attributes, tamper, cross-site/foreign-Origin/text-plain CSRF, SSE re-emit across split frames and thought filtering, image+schema, function-calling loop (signature, id, role echoed), sliding refresh, idle and absolute limits, logout-all, Gemini request shape (header, `store:false`, thinkingLevel, systemInstruction) | 30 of 30 pass, run twice, also from a clean copy |
| Lockout schedule with `fails` = 4, 5, 9, 30 | 30 s, 60 s, 900 s, 900 s |
| `test-push.mjs` (Node): headers, JWT claims and signature, RFC-style decrypt with `node:crypto`, JWT reuse | 8 of 8 |
| `test-cron.mjs` (workerd): `/__scheduled` -> D1 -> push to two mock endpoints, 410 deletes subscription | 3 of 3 |
| Pages Functions variant in `C_code_v1/pages-variant/` with `wrangler pages dev` (imports the same `src/app.js`): static `_headers`, 401, login cookie, headers from code, session, SSE | 6 of 6 |
| `wrangler deploy --dry-run` of the Workers config (cron, observability, placement, secrets) | bundle 19 KiB, accepted (secrets marked experimental in 4.77.0) |
| Read-only account probes (`whoami`, `login --scopes-list`, `d1 list`, `r2 bucket list`, `pages project list`) | worked; two accounts visible |
| workerd probes: `timingSafeEqual` length error, PBKDF2 600k allowed locally, `TextDecoderStream`/`TextEncoderStream` present, AES-GCM helper | as stated in 2.4 |

To rerun: in `C_code_v1/`: `export CLOUDFLARE_ACCOUNT_ID=00000000000000000000000000000000; node make-test-vars.mjs; wrangler d1 migrations apply sleep-coach-test -c wrangler.test.toml --local; node mock-gemini.mjs & wrangler dev -c wrangler.test.toml --port 8791 --ip 127.0.0.1 --local --test-scheduled &` then `node test.mjs; node test-push.mjs; node test-cron.mjs`. `make-test-vars.mjs` writes FAKE secrets (`.dev.vars` is git-ignorable; not copied here).

## 6. Open, [UNVERIFIED] or needs a device or key

1. Live Gemini behaviour: model IDs for this key, `store` field acceptance on REST generateContent, `thinkingLevel` casing, per-part `mediaResolution`, real SSE frames, 429 numbers. Run the smoke test in 1.7.
2. Free-tier RPM/TPM/RPD numbers (dashboard only).
3. iPhone tests (10 minutes, installed app on iOS 26/27): (a) log in inside the installed app, kill it, reopen after a day and after 3 days: still logged in? (b) `capture` input: camera direct or menu, HEIC or JPEG, EXIF rotation; (c) push permission from a tap, push arrives with app closed, badge; (d) Face ID passkey prompt in standalone; (e) password-manager autofill in the login field.
4. SSE through the Cloudflare edge in production (only tested in workerd): deploy and stream from the phone.
5. Whether a Permissions-Policy that fully disables the camera (`camera=()`) would break `<input capture>`; the code uses `camera=(self)` to stay safe.
6. Pages: no formal deprecation notice found elsewhere; production PBKDF2 cap not re-tested by me (sourced from workerd #1346, community thread was behind a bot challenge and not opened).
7. Android: whether an installed PWA shares cookies with Chrome; Push on tabs vs installed.
8. Legal reading of the Gemini terms (medical clause) and Israeli health-data rules: owner and counsel; outside this track.

## 7. Sources actually opened

Gemini docs were read as raw markdown (`<page>.md.txt`); Cloudflare docs as `<page>/index.md`; OWASP from the CheatSheetSeries and ASVS GitHub sources; WebKit and Apple pages as HTML/markdown.

- [G1] https://ai.google.dev/gemini-api/docs/models
- [G2] https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash (and the sibling pages gemini-3.7-flash, gemini-3.6-flash, gemini-3.5-flash, gemini-3.5-flash-lite, gemini-3.1-flash-lite, gemini-3.1-pro-preview, gemini-3-flash-preview)
- [G3] https://ai.google.dev/gemini-api/docs/pricing
- [G4] https://ai.google.dev/gemini-api/docs/deprecations
- [G5] https://ai.google.dev/gemini-api/docs/rate-limits
- [G6] https://ai.google.dev/gemini-api/docs/billing
- [G7] https://ai.google.dev/gemini-api/terms
- [G8] https://ai.google.dev/gemini-api/docs/usage-policies
- [G9] https://ai.google.dev/gemini-api/docs/logs-datasets and https://ai.google.dev/gemini-api/docs/logs-policy
- [G10] https://ai.google.dev/gemini-api/docs/available-regions
- [G11] https://ai.google.dev/gemini-api/docs/api-key
- [G12] https://ai.google.dev/api/generate-content
- [G13] https://ai.google.dev/api/caching (ToolConfig, FunctionCallingConfig)
- [G14] https://ai.google.dev/gemini-api/docs/interactions , https://ai.google.dev/gemini-api/docs/interactions-breaking-changes-may-2026 , https://ai.google.dev/gemini-api/docs/migrate-to-interactions
- [G15] https://ai.google.dev/gemini-api/docs/thinking , https://ai.google.dev/gemini-api/docs/gemini-3
- [G16] https://ai.google.dev/gemini-api/docs/latest-model
- [G17] https://ai.google.dev/gemini-api/docs/image-understanding
- [G18] https://ai.google.dev/gemini-api/docs/media-resolution
- [G19] https://ai.google.dev/gemini-api/docs/structured-output
- [G20] https://ai.google.dev/gemini-api/docs/function-calling
- [G21] https://ai.google.dev/gemini-api/docs/troubleshooting , https://ai.google.dev/gemini-api/docs/api-errors
- [G22] https://ai.google.dev/gemini-api/docs/flex-inference
- [G23] https://github.com/googleapis/js-genai (files src/models.ts, src/converters/_models_converters.ts, src/web/_web_auth.ts, src/types.ts, main branch)
- [C1] https://developers.cloudflare.com/workers/platform/limits/ (updated 2026-09-05)
- [C2] https://developers.cloudflare.com/workers/platform/pricing/
- [C3] https://developers.cloudflare.com/pages/platform/limits/ (2026-09-05)
- [C4] https://developers.cloudflare.com/pages/functions/pricing/ (2026-09-08)
- [C5] https://developers.cloudflare.com/d1/platform/limits/ (2026-04-21)
- [C6] https://developers.cloudflare.com/d1/platform/pricing/
- [C7] https://developers.cloudflare.com/kv/platform/limits/ and https://developers.cloudflare.com/kv/platform/pricing/
- [C8] https://developers.cloudflare.com/r2/platform/limits/ and https://developers.cloudflare.com/r2/pricing/
- [C9] https://developers.cloudflare.com/pages/ (2026-08-25)
- [C10] https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/ (2026-09-22, compatibility matrix)
- [C11] https://developers.cloudflare.com/workers/configuration/cron-triggers/ (2026-09-04)
- [C12] https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/
- [C13] https://developers.cloudflare.com/workflows/reference/limits/ , https://developers.cloudflare.com/queues/platform/limits/ , https://developers.cloudflare.com/queues/platform/pricing/
- [C14] https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
- [C15] https://github.com/cloudflare/workerd/issues/1346 (PBKDF2 100,000 cap)
- [C16] https://developers.cloudflare.com/d1/wrangler-commands/ , https://developers.cloudflare.com/d1/reference/migrations/ , https://developers.cloudflare.com/d1/worker-api/return-object/
- [C17] https://developers.cloudflare.com/pages/functions/wrangler-configuration/ , https://developers.cloudflare.com/pages/functions/bindings/ , https://developers.cloudflare.com/pages/functions/routing/
- [C18] https://developers.cloudflare.com/workers/wrangler/commands/pages/ , https://developers.cloudflare.com/pages/get-started/direct-upload/
- [C19] https://developers.cloudflare.com/workers/configuration/placement/
- [C20] https://developers.cloudflare.com/d1/reference/data-security/
- [C21] https://developers.cloudflare.com/workers/wrangler/configuration/ , https://developers.cloudflare.com/workers/configuration/secrets/
- [C22] https://developers.cloudflare.com/pages/configuration/headers/ , https://developers.cloudflare.com/workers/static-assets/headers/
- [C23] https://developers.cloudflare.com/changelog/product/pages/
- [L1] Local `wrangler` 4.77.0 on this Mac: `whoami`, `login --scopes-list`, `d1 list`, `r2 bucket list`, `pages project list`, `--help` of d1/pages/secret commands; npm registry `wrangler` latest 4.143.0.
- [L2] Tested project `C_code_v1/` (workerd via wrangler dev, local D1, Node 25).
- [L3] Node 25 micro-benchmark of PBKDF2-SHA256 and HMAC (Apple silicon), `pbkdf2_bench.mjs` (not kept).
- [L4] Node/ICU computation of Asia/Jerusalem offsets.
- [W1] https://webkit.org/tracking-prevention/
- [W2] https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
- [W3] https://webkit.org/blog/14403/updates-to-storage-policy/
- [W4] https://developer.apple.com/videos/play/wwdc2023/10120/ (What's new in web apps)
- [W5] https://bugs.webkit.org/show_bug.cgi?id=181849
- [W6] https://bugs.webkit.org/show_bug.cgi?id=272325
- [W7] https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- [W8] https://webkit.org/blog/12945/meet-web-push/
- [W9] https://webkit.org/blog/16574/webkit-features-in-safari-18-4/ , https://webkit.org/blog/16535/meet-declarative-web-push/
- [W10] https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ (also 26.2 https://webkit.org/blog/17640/webkit-features-for-safari-26-2/ and 26.4 https://webkit.org/blog/17862/webkit-features-for-safari-26-4/)
- [W11] https://webkit.org/blog/18325/webkit-features-for-safari-27-0/ (2026-09-17)
- [W12] https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers
- [W13] https://webkit.org/blog/14445/webkit-features-in-safari-17-0/
- [W14] https://bugs.webkit.org/show_bug.cgi?id=291258
- [M1] https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture
- [M2] https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- [M3] https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing
- [X1] https://developer.chrome.com/blog/cookie-max-age-expires
- [X2] https://developers.google.com/search/docs/crawling-indexing/block-indexing
- [X3] https://www.rfc-editor.org/rfc/rfc8291 (Web Push encryption, section 5 and Appendix A vector)
- [X4] https://www.rfc-editor.org/rfc/rfc8292 (VAPID)
- [X5] https://github.com/MasterKale/SimpleWebAuthn (README) and npm metadata for @simplewebauthn/server
- [X6] MDN browser-compat-data JSON (html/elements/input, api/Navigator, api/PushManager, api/PublicKeyCredential, api/Notification, api/StorageManager) at https://github.com/mdn/browser-compat-data
- [O1] https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- [O2] https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- [O3] https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- [O4] https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- [O5] https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- [O6] https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- [O7] OWASP ASVS 5.0 chapters V3, V6, V7: https://github.com/OWASP/ASVS/tree/master/5.0/en
