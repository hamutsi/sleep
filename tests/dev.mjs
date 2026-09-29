// שרת פיתוח מקומי לצפייה בדפדפן: האפליקציה + גוגל מדומה + נתוני דוגמה מוכנים.
// כניסה: הסיסמה לבדיקה היא  correct horse battery staple   (ערך בדיקה בלבד, לא קשור לסיסמה האמיתית).
// הרצה:  node tests/dev.mjs   ואז לפתוח http://127.0.0.1:8791
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { randomBytes, createHmac } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startMock } from './mock-google.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const CFG = path.join(here, 'wrangler.test.toml');
const PORT = 8791, MOCK_PORT = 8792, APP = `http://127.0.0.1:${PORT}`;
const persist = mkdtempSync(path.join(tmpdir(), 'sleepcoach-dev-'));
const env = { ...process.env, CI: '1', CLOUDFLARE_ACCOUNT_ID: '0'.repeat(32), WRANGLER_SEND_METRICS: 'false' };
const W = ['--yes', 'wrangler@latest'];
const b64u = (n) => randomBytes(n).toString('base64url');
const PASS = 'correct horse battery staple', PEPPER = b64u(32);
const CLIENT_ID = 'test-client.apps.googleusercontent.com', CLIENT_SECRET = 'test-secret-' + b64u(6);
const vars = {
  SESSION_SECRET: b64u(32), DATA_KEY: b64u(32), LOGIN_PEPPER: PEPPER,
  PASS_VERIFIER: createHmac('sha256', PEPPER).update('login:' + PASS).digest('base64url'),
  GOOGLE_CLIENT_ID: CLIENT_ID, GOOGLE_CLIENT_SECRET: CLIENT_SECRET, APP_URL: APP,
  GH_API_BASE: `http://127.0.0.1:${MOCK_PORT}/v4`, GOOGLE_TOKEN_URL: `http://127.0.0.1:${MOCK_PORT}/token`, GOOGLE_REVOKE_URL: `http://127.0.0.1:${MOCK_PORT}/revoke`,
  GEMINI_API_KEY: 'test-gemini-key', GEMINI_BASE: `http://127.0.0.1:${MOCK_PORT}/gemini/v1beta`,
  GEMINI_TIER: 'paid',
};
const seedFlag = process.argv.includes('--no-seed') ? false : true;

const mock = await startMock(MOCK_PORT, { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, appUrl: APP });
execFileSync('npx', [...W, 'd1', 'migrations', 'apply', 'DB', '--local', '--persist-to', persist, '--config', CFG], { env, stdio: 'ignore' });
const dev = spawn('npx', [...W, 'dev', '--config', CFG, '--port', String(PORT), '--ip', '127.0.0.1', '--persist-to', persist,
  ...Object.entries(vars).flatMap(([k, v]) => ['--var', `${k}:${v}`])], { env, stdio: 'inherit' });

const stop = () => { try { dev.kill('SIGTERM'); } catch { /* */ } try { mock.close(); } catch { /* */ } try { rmSync(persist, { recursive: true, force: true }); } catch { /* */ } process.exit(0); };
process.on('SIGTERM', stop); process.on('SIGINT', stop);

const J = { 'content-type': 'application/json' };
for (let i = 0; i < 120; i++) { try { if ((await fetch(APP + '/')).status === 200) break; } catch { /* */ } await new Promise((r) => setTimeout(r, 500)); }
if (seedFlag) {
  const lr = await fetch(APP + '/api/login', { method: 'POST', headers: J, body: JSON.stringify({ passphrase: PASS }) });
  const cookie = (lr.headers.get('set-cookie') || '').split(';')[0];
  const c = await fetch(APP + '/api/gh/connect', { headers: { cookie }, redirect: 'manual' });
  const state = new URL(c.headers.get('location')).searchParams.get('state');
  await fetch(`${APP}/api/gh/callback?code=mockcode&state=${state}`, { redirect: 'manual' });
  await fetch(APP + '/api/gh/sync', { method: 'POST', headers: { ...J, cookie }, body: '{}' });
  console.log('נתוני דוגמה נטענו (חיבור מדומה + לילה אחד).');
}
console.log(`מוכן: ${APP}   סיסמה לבדיקה: ${PASS}`);
