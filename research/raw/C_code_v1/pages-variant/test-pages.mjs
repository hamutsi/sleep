// cd pages-variant; cp ../.dev.vars .; wrangler d1 migrations apply sleep-coach-test --local; wrangler pages dev --port 8792 --ip 127.0.0.1
// (mock-gemini.mjs running from the parent folder)
const B = 'http://127.0.0.1:8792';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
const J = { 'content-type': 'application/json' };
const post = (p, b, h = {}) => fetch(B + p, { method: 'POST', headers: { ...J, ...h }, body: JSON.stringify(b) });
const idx = await fetch(B + '/');
ok(idx.status === 200 && idx.headers.get('x-robots-tag')?.includes('noindex'), 'Pages: static shell gets _headers');
ok((await fetch(B + '/api/me')).status === 401, 'Pages: /api/me unauthenticated -> 401 from functions/api/[[route]].js');
const lr = await post('/api/login', { passphrase: 'correct horse battery staple' });
const cookie = (lr.headers.get('set-cookie') || '').split(';')[0];
ok(lr.status === 200 && cookie.startsWith('__Host-sc='), 'Pages: login sets __Host- cookie');
ok(lr.headers.get('strict-transport-security') && lr.headers.get('x-content-type-options') === 'nosniff', 'Pages: security headers set from code on Function responses');
ok((await fetch(B + '/api/me', { headers: { cookie } })).status === 200, 'Pages: session verified');
const cr = await post('/api/chat', { messages: [{ role: 'user', text: 'hi' }] }, { cookie });
const raw = await cr.text();
ok(cr.headers.get('content-type').startsWith('text/event-stream') && raw.includes('"done":true'), 'Pages: SSE streaming works through Pages Functions');
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
