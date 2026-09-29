import { execSync } from 'node:child_process';
import { createECDH } from 'node:crypto';
const env = { ...process.env, CLOUDFLARE_ACCOUNT_ID: '0'.repeat(32) };
const d1 = (sql) => execSync(`wrangler d1 execute sleep-coach-test -c wrangler.test.toml --local --json --command "${sql}"`, { env, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
const mk = () => { const e = createECDH('prime256v1'); e.generateKeys(); return [e.getPublicKey().toString('base64url'), crypto.getRandomValues(Buffer.alloc(16)).toString('base64url')]; };
d1('DELETE FROM push_subscriptions');
for (const id of ['ok', 'gone']) { const [k, a] = mk(); d1(`INSERT INTO push_subscriptions (endpoint, p256dh, auth, created_at) VALUES ('http://127.0.0.1:8799/push/${id}', '${k}', '${a}', 1)`); }
const before = (await (await fetch('http://127.0.0.1:8799/__log')).json()).filter((x) => x.push).length;
const r = await fetch('http://127.0.0.1:8791/__scheduled');
console.log('scheduled endpoint ->', r.status, (await r.text()).slice(0, 120));
const log = (await (await fetch('http://127.0.0.1:8799/__log')).json()).filter((x) => x.push).slice(before);
ok(log.length === 2, 'cron sent one push per stored subscription (' + log.map((x) => x.path).join(', ') + ')');
const h = log[0]?.push.headers || {};
ok(/^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=[\w-]{87}$/.test(h.authorization || '') && h['content-encoding'] === 'aes128gcm' && h.ttl === '3600' && h.topic === 'bedtime' && log[0].push.bytes > 100, 'headers: vapid Authorization, aes128gcm, TTL 3600, Topic; body bytes=' + log[0]?.push.bytes);
const left = JSON.parse(d1('SELECT endpoint FROM push_subscriptions'))[0].results.map((x) => x.endpoint);
ok(left.length === 1 && left[0].endsWith('/push/ok'), 'HTTP 410 subscription deleted from D1, live one kept: ' + left.join(','));
d1('DELETE FROM push_subscriptions');
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
