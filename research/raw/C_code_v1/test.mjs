import { execSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
const B = 'http://127.0.0.1:8791';
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
const J = { 'content-type': 'application/json' };
const post = (p, body, h = {}) => fetch(B + p, { method: 'POST', headers: { ...J, ...h }, body: JSON.stringify(body) });
const resetLock = () => execSync('wrangler d1 execute sleep-coach-test -c wrangler.test.toml --local --command "UPDATE auth_state SET fails=0, locked_until=0, session_version=1 WHERE id=1" ', { env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: '0'.repeat(32) }, stdio: 'pipe' });

// 1. RFC 8291 section 5 vector (independent reference)
const expected = ('DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27ml' + 'mlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPT' + 'pK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN');
const got = await (await fetch(B + '/__rfc8291')).text();
ok(got === expected, 'RFC 8291 test vector reproduced byte-for-byte in workerd (' + got.length + ' chars)');
if (got !== expected) console.log('   got     ', got, '\n   expected', expected);

// 2. static assets + headers
const idx = await fetch(B + '/');
ok(idx.status === 200 && idx.headers.get('x-robots-tag')?.includes('noindex') && idx.headers.get('content-security-policy')?.includes("frame-ancestors 'none'"), 'static shell served with _headers (CSP, X-Robots-Tag)');
const ua = await fetch(B + '/api/me');
ok(ua.headers.get('x-robots-tag')?.includes('noindex') && ua.headers.get('strict-transport-security')?.includes('max-age=63072000'), 'API responses carry X-Robots-Tag: noindex and HSTS (no robots.txt Disallow, so crawlers can see noindex)');

// 3. unauth
ok((await fetch(B + '/api/me')).status === 401, '/api/me without cookie -> 401');

// 4. throttle: 4 wrong, 5th wrong sets 30s lock, 6th (correct) refused with 429
resetLock();
let codes = [];
for (let i = 0; i < 5; i++) codes.push((await post('/api/login', { passphrase: 'wrong' + i })).status);
ok(codes.join() === '401,401,401,401,401', 'five wrong passphrases -> 401 each: ' + codes.join());
const locked = await post('/api/login', { passphrase: 'correct horse battery staple' });
const lj = await locked.json();
ok(locked.status === 429 && lj.retry_after >= 25 && locked.headers.get('retry-after'), 'sixth attempt (even correct) -> 429 with Retry-After=' + lj.retry_after);
resetLock();

// 5. login + cookie attributes
const bad = await post('/api/login', { passphrase: 'x'.repeat(300) });
ok(bad.status === 400, 'over-long passphrase rejected (400) before hashing');
const lr = await post('/api/login', { passphrase: 'correct horse battery staple' });
const sc = lr.headers.get('set-cookie') || '';
ok(lr.status === 200 && /^__Host-sc=[\w-]+\.[\w-]+;/.test(sc) && /Max-Age=15552000/.test(sc) && /HttpOnly/.test(sc) && /Secure/.test(sc) && /SameSite=Strict/.test(sc) && /Path=\//.test(sc) && !/Domain=/.test(sc), 'login sets __Host- cookie, 180d, HttpOnly, Secure, SameSite=Strict, no Domain');
const cookie = sc.split(';')[0];
ok(lr.headers.get('cache-control') === 'no-store' && lr.headers.get('x-content-type-options') === 'nosniff', 'API responses: no-store + nosniff');
const me = await fetch(B + '/api/me', { headers: { cookie } });
ok(me.status === 200, '/api/me with cookie -> 200');
ok(!me.headers.get('set-cookie'), 'fresh cookie not re-issued on every request');

// 7. tamper
const [p, s] = cookie.split('=')[1].split('.');
const badCookie = '__Host-sc=' + p.slice(0, -2) + 'AA.' + s;
ok((await fetch(B + '/api/me', { headers: { cookie: badCookie } })).status === 401, 'tampered payload -> 401');

// 8. CSRF
ok((await post('/api/chat', { messages: [] }, { cookie, 'sec-fetch-site': 'cross-site' })).status === 403, 'Sec-Fetch-Site: cross-site POST -> 403');
ok((await post('/api/chat', { messages: [] }, { cookie, origin: 'https://evil.example' })).status === 403, 'foreign Origin POST -> 403');
ok((await fetch(B + '/api/chat', { method: 'POST', headers: { cookie, 'content-type': 'text/plain' }, body: '{}' })).status === 403, 'text/plain (simple request) POST -> 403');

// 9. streaming chat
const cr = await post('/api/chat', { messages: [{ role: 'user', text: 'hi' }] }, { cookie });
ok(cr.headers.get('content-type').startsWith('text/event-stream'), 'chat returns text/event-stream');
const reader = cr.body.getReader(); const td = new TextDecoder(); let raw = '', chunks = 0;
for (;;) { const { done, value } = await reader.read(); if (done) break; chunks++; raw += td.decode(value); }
const evs = raw.split('\n\n').filter(Boolean).map((e) => JSON.parse(e.replace(/^data: /, '')));
const text = evs.filter((e) => e.t).map((e) => e.t).join('');
ok(text === 'שלום עולם!', 'stream text reassembled across split SSE frames: ' + text);
ok(!raw.includes('hidden thought'), 'thought parts are not forwarded');
ok(evs.at(-1).done === true && evs.at(-1).usage?.totalTokenCount === 15, 'final done event carries usageMetadata');
ok(chunks >= 2, 'response arrived incrementally in ' + chunks + ' chunks');

// 10. image + schema
const mr = await post('/api/meal', { image: Buffer.from('fakejpeg').toString('base64'), mime: 'image/jpeg' }, { cookie });
const mj = await mr.json();
ok(mr.status === 200 && mj.meal.total_kcal === 195 && mj.usage.promptTokenCount === 1180, 'image + responseJsonSchema call parsed');

// 11. function calling round trip (mock asserts thoughtSignature + id + role echoed)
const fr = await post('/api/coach', { text: 'איך ישנתי?' }, { cookie });
const fj = await fr.json();
ok(fr.status === 200 && fj.text === 'ממוצע שינה 6.9 שעות', 'function-calling round trip ok: ' + JSON.stringify(fj.text));

// 12. sliding refresh with an old-but-valid cookie
const secret = "test-session-secret-0123456789abcdef0123456789abcdef";
const mint = (o) => { const pp = Buffer.from(JSON.stringify(o)).toString('base64url'); return pp + '.' + createHmac('sha256', secret).update('sc1.' + pp).digest('base64url'); };
const t = Math.floor(Date.now() / 1000);
const old = '__Host-sc=' + mint({ v: 1, iat: t - 3 * 86400, ts: t - 2 * 86400 });
const rr = await fetch(B + '/api/me', { headers: { cookie: old } });
ok(rr.status === 200 && /Max-Age=15552000/.test(rr.headers.get('set-cookie') || ''), 'cookie older than 24h is re-issued (sliding expiry)');
const tooOld = '__Host-sc=' + mint({ v: 1, iat: t - 400 * 86400, ts: t - 1 * 86400 });
ok((await fetch(B + '/api/me', { headers: { cookie: tooOld } })).status === 401, 'absolute lifetime (365d) enforced');
const idle = '__Host-sc=' + mint({ v: 1, iat: t - 300 * 86400, ts: t - 200 * 86400 });
ok((await fetch(B + '/api/me', { headers: { cookie: idle } })).status === 401, 'idle lifetime (180d) enforced');

// 13. global logout
const la = await post('/api/logout-all', {}, { cookie });
ok(la.status === 200 && /Max-Age=0/.test(la.headers.get('set-cookie') || ''), 'logout-all clears cookie');
ok((await fetch(B + '/api/me', { headers: { cookie } })).status === 401, 'old cookie rejected after version bump');
resetLock();

// 14. what the Worker actually sent to "Gemini"
const glog = await (await fetch('http://127.0.0.1:8799/__log')).json();
const g = glog.filter((x) => x.path.includes(':'));
ok(g.length === 4 && g.every((x) => x.key), 'Gemini mock saw 4 calls (1 stream + 1 image + 2 tool-loop turns), all with x-goog-api-key header and none with ?key=: ' + g.map((x) => x.path.split('/').pop() + x.search).join(' | '));
ok(g.every((x) => x.body.store === false), 'every request sets store:false');
ok(g[0].body.generationConfig.thinkingConfig.thinkingLevel === 'LOW' && g[0].body.systemInstruction.parts[0].text.includes('sleep coach'), 'thinkingLevel + systemInstruction sent');
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
