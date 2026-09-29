// בדיקות אינטגרציה מקומיות: wrangler dev (workerd) + D1 מקומי + שרת גוגל מדומה.
// הרצה:  node tests/run.mjs        (דורש אינטרנט רק להורדת wrangler הראשונה דרך npx)
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { randomBytes, createHmac } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startMock, SCOPES } from './mock-google.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const CFG = path.join(here, 'wrangler.test.toml');
const PORT = 8791, MOCK_PORT = 8792;
const APP = `http://127.0.0.1:${PORT}`;
const persist = mkdtempSync(path.join(tmpdir(), 'sleepcoach-'));
const env = { ...process.env, CI: '1', CLOUDFLARE_ACCOUNT_ID: '0'.repeat(32), WRANGLER_SEND_METRICS: 'false' };
const W = ['--yes', 'wrangler@latest'];
const b64u = (n) => randomBytes(n).toString('base64url');

const PASS = 'correct horse battery staple';
const PEPPER = b64u(32);
const CLIENT_ID = 'test-client.apps.googleusercontent.com';
const CLIENT_SECRET = 'test-secret-' + b64u(6);
const vars = {
  SESSION_SECRET: b64u(32), DATA_KEY: b64u(32), LOGIN_PEPPER: PEPPER,
  PASS_VERIFIER: createHmac('sha256', PEPPER).update('login:' + PASS.normalize('NFKC').trim()).digest('base64url'),
  GOOGLE_CLIENT_ID: CLIENT_ID, GOOGLE_CLIENT_SECRET: CLIENT_SECRET, APP_URL: APP,
  GH_API_BASE: `http://127.0.0.1:${MOCK_PORT}/v4`, GOOGLE_TOKEN_URL: `http://127.0.0.1:${MOCK_PORT}/token`, GOOGLE_REVOKE_URL: `http://127.0.0.1:${MOCK_PORT}/revoke`,
  GEMINI_API_KEY: 'test-gemini-key', GEMINI_BASE: `http://127.0.0.1:${MOCK_PORT}/gemini/v1beta`,
  GEMINI_TIER: 'paid', COACH_FORCE_HOUR: '9', GEMINI_DAILY_CAP: '400',
};
const TODAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const COACH_TODAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Date.now() - 4 * 3600 * 1000));
const plusDays = (d, n) => { const [y, m, dd] = d.split('-').map(Number); return new Date(Date.UTC(y, m - 1, dd + n)).toISOString().slice(0, 10); };

let pass = 0, fail = 0;
const ok = (c, m, extra) => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'} ${m}${!c && extra !== undefined ? '\n     ' + String(extra).slice(0, 400) : ''}`); };
const J = { 'content-type': 'application/json' };
// חיבור שהשרת סגר אחרי השהיה ארוכה (למשל אחרי d1 execute) נכשל בשליחה הראשונה. הבקשה לא הגיעה לשרת, ולכן ניסיון חוזר בטוח.
async function rfetch(url, init, tries = 3) {
  for (let i = 0; ; i++) { try { return await fetch(url, init); } catch (e) { if (i >= tries - 1) throw e; await new Promise((r) => setTimeout(r, 250)); } }
}
const call = (p, { method = 'GET', body, cookie, headers = {} } = {}) =>
  rfetch(APP + p, { method, redirect: 'manual', headers: { ...(method !== 'GET' ? J : {}), ...(cookie ? { cookie } : {}), ...headers }, body: method === 'GET' ? undefined : JSON.stringify(body ?? {}) });
const ctl = (o) => rfetch(`http://127.0.0.1:${MOCK_PORT}/__control`, { method: 'POST', body: JSON.stringify(o) });
const wr = (args) => execFileSync('npx', [...W, ...args], { env, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const d1 = (sql) => { const out = wr(['d1', 'execute', 'DB', '--local', '--persist-to', persist, '--config', CFG, '--command', sql, '--json']); return JSON.parse(out.slice(out.indexOf('[')))[0].results; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const resetLock = () => d1('UPDATE auth_state SET fails = 0, locked_until = 0 WHERE id = 1');

async function login() {
  const r = await call('/api/login', { method: 'POST', body: { passphrase: PASS } });
  return { r, cookie: (r.headers.get('set-cookie') || '').split(';')[0] };
}
// מתחיל חיבור ומסיים אותו (או נכשל) כמו שגוגל היתה עושה. מחזיר את הכתובת שאליה האפליקציה מפנה.
async function connectFlow(cookie, callbackQuery = (s) => `code=mockcode&state=${s}`) {
  const c = await call('/api/gh/connect', { cookie });
  const state = new URL(c.headers.get('location')).searchParams.get('state');
  const cb = await call(`/api/gh/callback?${callbackQuery(state)}`);
  return { state, location: cb.headers.get('location'), status: cb.status };
}
const statusOf = async (cookie) => (await (await call('/api/gh/status', { cookie })).json());

let dev, mock;
async function main() {
  mock = await startMock(MOCK_PORT, { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, appUrl: APP });
  console.log('מפעיל מסד מקומי ושרת פיתוח (הפעם הראשונה איטית)...');
  wr(['d1', 'migrations', 'apply', 'DB', '--local', '--persist-to', persist, '--config', CFG]);
  dev = spawn('npx', [...W, 'dev', '--config', CFG, '--port', String(PORT), '--ip', '127.0.0.1', '--persist-to', persist,
    ...Object.entries(vars).flatMap(([k, v]) => ['--var', `${k}:${v}`])], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  dev.stdout.on('data', (d) => (logs += d)); dev.stderr.on('data', (d) => (logs += d));
  for (let i = 0; i < 120; i++) { try { if ((await fetch(APP + '/')).status === 200) break; } catch { /* עוד לא עלה */ } await sleep(500); if (i === 119) throw new Error('dev server did not start\n' + logs.slice(-1500)); }

  /* 1. קבצים סטטיים */
  const idx = await call('/');
  ok(idx.status === 200 && (await idx.text()).includes('id="app"'), 'המעטפת הסטטית מוגשת');
  ok((idx.headers.get('content-security-policy') || '').includes("frame-ancestors 'none'") && (idx.headers.get('x-robots-tag') || '').includes('noindex'), 'קבצים סטטיים: CSP ו-noindex', [...idx.headers].join(' | '));
  ok(((await call('/manifest.webmanifest')).headers.get('content-type') || '').includes('manifest+json'), 'manifest בסוג הנכון');
  ok(((await call('/sw.js')).headers.get('cache-control') || '').includes('no-cache'), 'sw.js לא נשמר במטמון');

  /* 2. בלי התחברות */
  for (const p of ['/api/me', '/api/gh/status', '/api/gh/last-night', '/api/gh/shape']) ok((await call(p)).status === 401, `${p} בלי התחברות מחזיר 401`);
  ok((await call('/api/gh/sync', { method: 'POST' })).status === 401, 'סנכרון בלי התחברות מחזיר 401');
  const un = await call('/api/me');
  ok((un.headers.get('strict-transport-security') || '').includes('max-age') && (un.headers.get('x-robots-tag') || '').includes('noindex') && un.headers.get('cache-control') === 'no-store', 'תשובות API: HSTS, noindex, no-store');
  const c0 = await call('/api/gh/connect');
  ok(c0.status === 302 && c0.headers.get('location') === `${APP}/`, 'חיבור בלי התחברות מפנה לדף הבית');

  /* 3. הגבלת ניסיונות */
  await resetLock();
  const codes = [];
  for (let i = 0; i < 5; i++) codes.push((await call('/api/login', { method: 'POST', body: { passphrase: 'wrong' + i } })).status);
  ok(codes.join() === '401,401,401,401,401', 'חמש סיסמאות שגויות מחזירות 401', codes.join());
  const locked = await call('/api/login', { method: 'POST', body: { passphrase: PASS } });
  const lj = await locked.json();
  ok(locked.status === 429 && lj.retry_after >= 25 && !!locked.headers.get('retry-after'), 'הניסיון השישי (גם נכון) נחסם עם 429', JSON.stringify(lj));
  await resetLock();
  ok((await call('/api/login', { method: 'POST', body: { passphrase: 'x'.repeat(300) } })).status === 400, 'סיסמה ארוכה מדי נדחית לפני הבדיקה');

  /* 4. התחברות ועוגייה */
  const { r: lr, cookie } = await login();
  const sc = lr.headers.get('set-cookie') || '';
  ok(lr.status === 200 && /^__Host-sc=[\w-]+\.[\w-]+;/.test(sc) && /Max-Age=15552000/.test(sc) && /HttpOnly/.test(sc) && /Secure/.test(sc) && /SameSite=Lax/.test(sc) && /Path=\//.test(sc) && !/Domain=/.test(sc), 'עוגייה: __Host-, 180 יום, HttpOnly, Secure, SameSite=Lax, בלי Domain', sc);
  ok((await call('/api/me', { cookie })).status === 200, '/api/me עם עוגייה מחזיר 200');
  const nfk = await login();
  ok(nfk.r.status === 200, 'ההתחברות אחרי הצלחה מתאפסת (אין נעילה שיורית)');

  /* 5. CSRF */
  ok((await call('/api/gh/sync', { method: 'POST', cookie, headers: { 'content-type': 'text/plain' } })).status === 403, 'CSRF: סוג תוכן שאינו JSON נדחה');
  ok((await call('/api/gh/sync', { method: 'POST', cookie, headers: { 'sec-fetch-site': 'cross-site' } })).status === 403, 'CSRF: בקשה בין אתרים נדחית');
  ok((await call('/api/gh/sync', { method: 'POST', cookie, headers: { origin: 'https://evil.example' } })).status === 403, 'CSRF: Origin זר נדחה');

  /* 6. מצב התחלתי ופתיחת החיבור */
  let st = await statusOf(cookie);
  ok(st.configured === true && st.status === 'disconnected', 'סטטוס התחלתי: מוגדר ולא מחובר', JSON.stringify(st));
  const c1 = await call('/api/gh/connect', { cookie });
  const loc = new URL(c1.headers.get('location'));
  const q = loc.searchParams;
  ok(c1.status === 302 && loc.host === 'accounts.google.com' && loc.pathname === '/o/oauth2/v2/auth', 'חיבור: הפניה למסך ההסכמה של גוגל', String(loc));
  ok(q.get('client_id') === CLIENT_ID && q.get('redirect_uri') === `${APP}/api/gh/callback` && q.get('response_type') === 'code' && q.get('access_type') === 'offline' && q.get('prompt') === 'consent', 'חיבור: client_id, redirect_uri, offline ו-consent נכונים');
  ok(SCOPES.every((s) => q.get('scope').split(' ').includes(s)) && q.get('scope').split(' ').length === 4 && !q.get('scope').includes('writeonly'), 'חיבור: ארבע הרשאות קריאה בלבד');
  ok((q.get('state') || '').length >= 40, 'חיבור: state אקראי וארוך');

  /* 7. החזרה מגוגל */
  ok((await call('/api/gh/callback?code=x&state=nope')).headers.get('location') === `${APP}/?gh=bad_state`, 'החזרה עם state לא מוכר נדחית');
  ok((await call('/api/gh/callback?error=access_denied')).headers.get('location') === `${APP}/?gh=denied`, 'החזרה אחרי סירוב נטפלת');
  const good = await connectFlow(cookie);
  ok(good.location === `${APP}/?gh=connected`, 'החזרה תקינה: חיבור הושלם', good.location);
  ok((await call(`/api/gh/callback?code=mockcode&state=${good.state}`)).headers.get('location') === `${APP}/?gh=bad_state`, 'state הוא חד-פעמי: שימוש חוזר נדחה');
  const row = d1('SELECT refresh_sealed, access_sealed, refresh_expires_at, health_user_id FROM gh_connection WHERE id = 1')[0];
  ok(row.refresh_sealed.startsWith('v1.') && !row.refresh_sealed.includes('mock-refresh') && row.access_sealed.startsWith('v1.') && !row.access_sealed.includes('mock-access'), 'טוקנים מוצפנים במסד ולא כטקסט גלוי');
  st = await statusOf(cookie);
  ok(st.status === 'connected' && st.tokenMode === 'testing' && st.scopesComplete === true && Math.abs(st.refreshExpiresAt - (Date.now() / 1000 + 604799)) < 120, 'סטטוס: מחובר, מצב בדיקה (7 ימים), הרשאות מלאות', JSON.stringify(st));

  /* 8. סנכרון ופענוח */
  const sy = await call('/api/gh/sync', { method: 'POST', cookie, body: { days: 3 } });
  const sj = await sy.json();
  ok(sy.status === 200 && sj.ok && sj.sleepSessions === 1 && sj.dailyDates === 1 && Object.values(sj.status).every((v) => v.ok), 'סנכרון: כל הסוגים תקינים, נשמר לילה אחד ויום אחד', JSON.stringify(sj));
  const { st: mst } = await (await rfetch(`http://127.0.0.1:${MOCK_PORT}/__state`)).json().then((s) => ({ st: s }));
  const sleepCall = mst.calls.find((c) => c.path.endsWith('/sleep/dataPoints:reconcile'));
  const sp = new URLSearchParams(sleepCall ? sleepCall.search : '');
  ok(sleepCall && sp.get('dataSourceFamily') === 'users/me/dataSourceFamilies/google-wearables' && /^sleep\.interval\.civil_end_time >= "\d{4}-\d{2}-\d{2}" AND sleep\.interval\.civil_end_time < "\d{4}-\d{2}-\d{2}"$/.test(sp.get('filter') || '') && sp.get('pageSize') === '25', 'בקשת שינה: reconcile, מכשיר לבישה בלבד, פילטר AIP-160, עמוד 25', sleepCall && sleepCall.search);
  const hrvCall = mst.calls.find((c) => c.path.includes('/daily-heart-rate-variability/'));
  ok(hrvCall && /^daily_heart_rate_variability\.date >= "\d{4}-\d{2}-\d{2}"$/.test(new URLSearchParams(hrvCall.search).get('filter') || ''), 'בקשת HRV: נתיב kebab-case ופילטר snake_case', hrvCall && hrvCall.search);
  ok(mst.calls.every((c) => /^Bearer mock-access-\d+$/.test(c.auth)), 'כל הבקשות נושאות טוקן Bearer');

  const night = (await (await call('/api/gh/last-night', { cookie })).json()).night;
  ok(night && night.night_date === COACH_TODAY && night.bed === '23:18' && night.wake === '07:02', 'הלילה האחרון: תאריך השכמה ושעות בשעון מקומי', JSON.stringify(night && [night.night_date, night.bed, night.wake]));
  ok(night.minutes_asleep === 407 && night.minutes_in_period === 464 && night.efficiency_pct === 88 && night.stages.deep === 114 && night.stages.light === 198 && night.stages.rem === 94 && night.stages.awake === 56 && night.stages.awake_count === 12, 'הלילה האחרון: דקות שינה, יעילות מחושבת ושלבים', JSON.stringify(night.stages));
  const rc = night.recovery.same_day || {};
  ok(rc.hrv_rmssd_ms === 38.4 && rc.rhr_bpm === 54 && rc.br_bpm === 14.2 && rc.spo2_avg === 96.1 && rc.skin_nightly_c === 33.9 && rc.skin_baseline_c === 33.6, 'מדדי התאוששות: HRV, דופק מנוחה, נשימות, SpO2, טמפרטורה', JSON.stringify(rc));
  const stStatus = await statusOf(cookie);
  ok(stStatus.lastSyncAt > 0 && stStatus.lastDeviceSync === `${COACH_TODAY}T04:20:00Z` && stStatus.deviceVersion === 'Fitbit Air', 'סטטוס: זמן סנכרון אחרון ומכשיר');

  /* 9. אבחון בלי ערכים */
  const shape = await (await call('/api/gh/shape', { cookie })).text();
  ok(!new RegExp(`407|38\\.4|users/111|${COACH_TODAY.slice(0, 7)}|Fitbit Air|mock-`).test(shape) && shape.includes('STAGES') && shape.includes('__array_len'), 'מבנה האבחון לא מכיל ערכים, מזהים או תאריכים', shape.slice(0, 300));

  /* 10. רענון טוקן ושגיאות */
  await ctl({ validAccess: 'revoked-by-test' });
  const sy2 = await (await call('/api/gh/sync', { method: 'POST', cookie })).json();
  const st2 = await (await fetch(`http://127.0.0.1:${MOCK_PORT}/__state`)).json();
  ok(sy2.ok && st2.tokenGrants.includes('refresh_token'), 'טוקן שנדחה (401) מרענן ומנסה שוב בהצלחה', JSON.stringify(sy2).slice(0, 200));
  await ctl({ invalidGrant: true, validAccess: 'revoked-again' });
  const sy3 = await call('/api/gh/sync', { method: 'POST', cookie });
  ok(sy3.status === 409 && (await sy3.json()).error === 'needs_reauth', 'invalid_grant מחזיר 409 needs_reauth ולא 401 (כדי לא לזרוק החוצה מהאפליקציה)');
  ok((await statusOf(cookie)).status === 'needs_reauth', 'סטטוס עובר ל-needs_reauth');
  await ctl({ invalidGrant: false });
  const again = await connectFlow(cookie);
  ok(again.location === `${APP}/?gh=connected` && (await statusOf(cookie)).status === 'connected', 'חיבור מחדש אחרי פקיעה עובד');

  /* 11. כשלי חיבור לא פוגעים בחיבור קיים */
  await ctl({ identity: { healthUserId: '222' } });
  const wa = await connectFlow(cookie);
  ok(wa.location === `${APP}/?gh=wrong_account` && (await statusOf(cookie)).status === 'connected', 'חשבון אחר נדחה והחיבור הקיים נשאר');
  await ctl({ identity: { healthUserId: '111', legacyUserId: 'A1B2C3' }, scope: 'openid email' });
  const sm = await connectFlow(cookie);
  ok(sm.location === `${APP}/?gh=scope_missing` && (await statusOf(cookie)).status === 'connected', 'הרשאות חסרות נדחות והחיבור הקיים נשאר');
  await ctl({ scope: SCOPES.join(' '), noRefresh: true });
  ok((await connectFlow(cookie)).location === `${APP}/?gh=no_refresh_token`, 'גוגל בלי refresh token: הודעה מתאימה');
  await ctl({ noRefresh: false, identityStatus: 412 });
  const pm = await connectFlow(cookie);
  ok(pm.location === `${APP}/?gh=profile_missing` && (await statusOf(cookie)).status === 'connected', 'פרופיל חסר (412): הודעה ובלי שיבוש חיבור קיים');
  await ctl({ identityStatus: 403 });
  const p403 = await connectFlow(cookie);
  ok(p403.location === `${APP}/?gh=identity_failed&why=http_403` && (await statusOf(cookie)).status === 'connected', 'API שלא הופעל (403 בזיהוי): הסיבה מועברת לממשק והחיבור הקיים נשאר', p403.location);
  await ctl({ identityStatus: 200 });
  ok((await fetch(`http://127.0.0.1:${MOCK_PORT}/__state`).then((r) => r.json())).revoked.length >= 3, 'טוקנים של ניסיונות שנכשלו בוטלו אצל גוגל');

  /* 11ב. המרת שעון ישראל לזמן מוחלט, כולל מעברי שעון קיץ וחורף */
  const { localToEpoch } = await import('../src/util.js');
  const utc = (y, m, d, h, mi) => Date.UTC(y, m - 1, d, h, mi) / 1000;
  ok(localToEpoch('2026-09-29', '20:45') === utc(2026, 9, 29, 17, 45), 'שעון קיץ (UTC+3): 20:45 מקומי הוא 17:45 UTC');
  ok(localToEpoch('2026-11-01', '20:45') === utc(2026, 11, 1, 18, 45), 'שעון חורף (UTC+2): 20:45 מקומי הוא 18:45 UTC');
  ok(localToEpoch('2026-10-24', '12:00') === utc(2026, 10, 24, 9, 0) && localToEpoch('2026-10-25', '12:00') === utc(2026, 10, 25, 10, 0), 'מעבר לשעון חורף ב-25.10.2026: היום שלפני ואחרי');
  ok(localToEpoch('2027-03-25', '12:00') === utc(2027, 3, 25, 10, 0) && localToEpoch('2027-03-26', '12:00') === utc(2027, 3, 26, 9, 0), 'מעבר לשעון קיץ ב-26.3.2027: היום שלפני ואחרי');

  /* 11ג. אין גישה בלי התחברות */
  for (const p of ['/api/profile', '/api/day', '/api/meals', '/api/workouts']) ok((await call(p)).status === 401, `${p} בלי התחברות מחזיר 401`);
  ok((await call('/api/meals/analyze', { method: 'POST', body: {} })).status === 401, 'ניתוח ארוחה בלי התחברות מחזיר 401');

  /* 11ד. פרופיל */
  ok(Object.keys((await (await call('/api/profile', { cookie })).json()).profile).length === 0, 'פרופיל ריק בהתחלה');
  const badP = await call('/api/profile', { method: 'PUT', cookie, body: { height_cm: 999 } });
  ok(badP.status === 400 && (await badP.json()).field === 'height_cm', 'פרופיל: גובה לא סביר נדחה עם שם השדה');
  ok((await call('/api/profile', { method: 'PUT', cookie, body: { usual_bed: '25:99' } })).status === 400, 'פרופיל: שעה לא תקינה נדחית');
  ok((await call('/api/profile', { method: 'PUT', cookie, body: { first_name: 'בדיקה', height_cm: 175, usual_bed: '23:15', usual_wake: '06:30', statin_name: 'test-statin', statin_dose: '10mg', statin_time: 'evening' } })).status === 200, 'פרופיל נשמר');
  const prof = (await (await call('/api/profile', { cookie })).json()).profile;
  ok(prof.height_cm === 175 && prof.statin_time === 'evening' && prof.usual_bed === '23:15' && prof.first_name === 'בדיקה', 'פרופיל נקרא בחזרה');

  /* 11ה. ניתוח ארוחה מול Gemini מדומה */
  const fake = Buffer.from('fake-jpeg-bytes').toString('base64');
  const an = await call('/api/meals/analyze', { method: 'POST', cookie, body: { image: fake, mime: 'image/jpeg', text: 'צהריים' } });
  const anj = await an.json();
  ok(an.status === 200 && anj.analysis.name === 'פסטה ברוטב שמנת' && anj.analysis.items.length === 2, 'ניתוח ארוחה מחזיר רכיבים', JSON.stringify(anj).slice(0, 200));
  ok(anj.analysis.totals.kcal === 570 && anj.analysis.totals.carbs_g === 84 && anj.analysis.totals.sat_fat_g === 10.5, 'הסכומים מחושבים בשרת מהרכיבים ולא מהסיכום השגוי של המודל', JSON.stringify(anj.analysis.totals));
  ok(anj.analysis.alcohol_g === 14 && anj.analysis.glycemic_load === 'high' && anj.analysis.questions.length === 1, 'אלכוהול, עומס גליקמי ושאלת הבהרה עוברים');
  const gs = (await (await fetch(`http://127.0.0.1:${MOCK_PORT}/__state`)).json()).gemini.at(-1);
  ok(gs.model === 'gemini-3.8-flash' && gs.key === 'test-gemini-key' && !gs.search.includes('key=') && gs.body.store === false && gs.body.generationConfig.responseMimeType === 'application/json' && !!gs.body.generationConfig.responseJsonSchema && gs.body.generationConfig.thinkingConfig.thinkingLevel === 'LOW' && !!gs.body.systemInstruction, 'בקשת Gemini: מודל יציב, מפתח בכותרת ולא ב-URL, store:false, סכמה, חשיבה LOW', JSON.stringify(gs).slice(0, 300));
  const pp = gs.body.contents[0].parts;
  ok(pp[0].text && pp[0].text.includes('צהריים') && pp[1].inlineData && pp[1].inlineData.mimeType === 'image/jpeg' && pp[1].inlineData.data === fake, 'הטקסט לפני התמונה, והתמונה עוברת כמו שהיא');
  ok((await call('/api/meals/analyze', { method: 'POST', cookie, body: {} })).status === 400, 'ניתוח בלי תמונה ובלי טקסט נדחה');
  ok((await call('/api/meals/analyze', { method: 'POST', cookie, body: { image: 'not base64 !!!' } })).status === 400, 'ניתוח עם תמונה שאינה base64 נדחה');
  ok((await call('/api/meals/analyze', { method: 'POST', cookie, body: { image: fake, mime: 'text/html' } })).status === 400, 'ניתוח עם סוג קובץ לא מותר נדחה');
  await ctl({ geminiStatus: 429 });
  ok((await call('/api/meals/analyze', { method: 'POST', cookie, body: { text: 'x' } })).status === 429, 'מכסת Gemini מלאה מחזירה 429');
  await ctl({ geminiStatus: 403 });
  const gk = await call('/api/meals/analyze', { method: 'POST', cookie, body: { text: 'x' } });
  ok(gk.status === 502 && (await gk.json()).error === 'gemini_key', 'מפתח Gemini נדחה מחזיר gemini_key');
  await ctl({ geminiStatus: 503 });
  const g503 = await call('/api/meals/analyze', { method: 'POST', cookie, body: { text: 'x' } });
  ok(g503.status === 502 && (await g503.json()).error === 'gemini_unavailable', 'עומס של גוגל (503) מחזיר gemini_unavailable אחרי ניסיון גם במודל הגיבוי, בלי לתלות את הבקשה');
  await ctl({ geminiStatus: 200, geminiBadKey: true });
  const gk2 = await call('/api/meals/analyze', { method: 'POST', cookie, body: { text: 'x' } });
  ok(gk2.status === 502 && (await gk2.json()).error === 'gemini_key', 'גוגל מחזירה 400 "API key not valid": ממופה ל-gemini_key ולא ל-gemini_bad_request');
  const ks = await (await call('/api/coach/selftest', { cookie })).json();
  ok(ks.hasKey === true && ks.ok === false && ks.status === 400 && ks.len === 'test-gemini-key'.length && ks.prefixOk === false && !JSON.stringify(ks).includes('test-gemini-key'), 'בדיקה עצמית של מפתח Gemini: נדחה, מציגה אורך ותחילית בלבד', JSON.stringify(ks));
  await ctl({ geminiBadKey: false });
  const ks2 = await (await call('/api/coach/selftest', { cookie })).json();
  ok(ks2.ok === true && ks2.status === 200, 'בדיקה עצמית של מפתח Gemini: תקין', JSON.stringify(ks2));
  ok((await call('/api/coach/selftest')).status === 401, 'בדיקת המפתח דורשת התחברות');
  await ctl({ geminiStatus: 200 });
  await ctl({ geminiStatus: 200, geminiEmpty: true });
  const ne = await call('/api/meals/analyze', { method: 'POST', cookie, body: { text: 'x' } });
  ok(ne.status === 422 && (await ne.json()).error === 'no_food_detected', 'תמונה בלי אוכל מחזירה 422');
  await ctl({ geminiEmpty: false });

  /* 11ו. יומן אוכל */
  const thumbBytes = 'thumb-bytes';
  const mc = await call('/api/meals', { method: 'POST', cookie, body: { date: TODAY, time: '20:45', kind: 'meal', name: anj.analysis.name, kcal: 570, protein_g: 17, carbs_g: 84, sugar_g: 7, fiber_g: 5, fat_g: 18, sat_fat_g: 10.5, caffeine_mg: 0, alcohol_g: 14, glycemic_load: 'high', items: anj.analysis.items, confidence: 'medium', source: 'photo', thumb: Buffer.from(thumbBytes).toString('base64') } });
  const mcj = await mc.json();
  ok(mc.status === 201 && /^[0-9a-f-]{36}$/.test(mcj.id), 'ארוחה נשמרת');
  ok((await call('/api/meals', { method: 'POST', cookie, body: { date: plusDays(TODAY, 10), time: '12:00', name: 'x' } })).status === 400, 'תאריך רחוק בעתיד נדחה');
  ok((await call('/api/meals', { method: 'POST', cookie, body: { date: plusDays(TODAY, -60), time: '12:00', name: 'x' } })).status === 400, 'תאריך רחוק בעבר נדחה');
  ok((await call('/api/meals', { method: 'POST', cookie, body: { date: TODAY, time: '12:00', name: '' } })).status === 400, 'ארוחה בלי שם נדחית');
  ok((await call('/api/meals', { method: 'POST', cookie, body: { date: TODAY, time: '12:00', name: 'x', kcal: -5 } })).status === 400, 'קלוריות שליליות נדחות');
  const lst = (await (await call(`/api/meals?date=${TODAY}`, { cookie })).json()).meals;
  const mine = lst.find((x) => x.id === mcj.id);
  ok(mine && mine.has_thumb === 1 && mine.thumb_b64 === undefined && mine.alcohol_g === 14 && mine.local_time === '20:45', 'הרשימה מחזירה סימון תמונה בלי לשלוח את התמונה', JSON.stringify(mine));
  const th = await call(`/api/meals/${mcj.id}/thumb`, { cookie });
  ok(th.status === 200 && th.headers.get('content-type') === 'image/jpeg' && (th.headers.get('cache-control') || '').includes('private') && Buffer.from(await th.arrayBuffer()).toString() === thumbBytes, 'התמונה הממוזערת מוגשת עם מטמון פרטי');
  ok((await call(`/api/meals/${mcj.id}/thumb`)).status === 401, 'התמונה הממוזערת דורשת התחברות');
  ok((await call(`/api/meals/${mcj.id}`, { method: 'DELETE', cookie, headers: { 'content-type': 'text/plain' } })).status === 403, 'CSRF: מחיקה בלי JSON נדחית');

  /* 11ז. רישום מהיר */
  const q1 = await call('/api/quick', { method: 'POST', cookie, body: { kind: 'coffee', time: '16:10', count: 2 } });
  ok(q1.status === 201, 'רישום מהיר של קפה');
  ok((await call('/api/quick', { method: 'POST', cookie, body: { kind: 'wine', time: '21:30' } })).status === 201, 'רישום מהיר של יין');
  for (const bad of ['constructor', '__proto__', 'vodka', '']) ok((await call('/api/quick', { method: 'POST', cookie, body: { kind: bad } })).status === 400, `רישום מהיר עם סוג "${bad}" נדחה`);
  ok((await call('/api/quick', { method: 'POST', cookie, body: { kind: 'coffee', count: 99 } })).status === 400, 'כמות לא סבירה נדחית');
  const day = await (await call(`/api/day?date=${TODAY}`, { cookie })).json();
  const cof = day.meals.find((x) => x.name === 'קפה x2');
  ok(cof && cof.caffeine_mg === 160 && cof.kind === 'drink' && cof.source === 'quick', 'קפה כפול: 160 מ״ג קפאין');
  ok(day.meals.find((x) => x.name === 'כוס יין').alcohol_g === 14, 'כוס יין: 14 גרם אלכוהול');
  ok(day.totals.caffeine_mg === 160 && day.totals.last_caffeine_time === '16:10' && day.totals.last_meal_time === '20:45' && day.totals.alcohol_g === 28 && day.totals.kcal === 570, 'סיכום יום: קפאין, אלכוהול, שעת קפה אחרונה ושעת ארוחה אחרונה', JSON.stringify(day.totals));
  ok(day.targets && day.targets.protein_g.goal === 122 && day.targets.protein_g.min === 109 && day.targets.weight_assumed === true && day.targets.kcal.goal > 1800 && day.targets.fat_g.kind === 'max' && day.totals.carbs_g === 84 && day.totals.fat_g === 18 && day.totals.sat_fat_g === 10.5 && day.totals.sugar_g === 7 && day.totals.fiber_g === 5, 'סיכום יום: מקרו וסוכרים, ויעדים למתאמן (חלבון 1.8 גר׳ לק״ג, משקל משוער 68)', JSON.stringify([day.targets, day.totals]));
  const { nutritionTargets } = await import('../src/nutrition.js');
  const nt = nutritionTargets({ weight_kg: 80, kcal_target: 2800, height_cm: 180 });
  ok(nt.protein_g.goal === 144 && nt.kcal.goal === 2800 && nt.weight_assumed === false && nt.kcal_assumed === false && nt.fat_g.goal === 93 && nt.sat_fat_g.goal === 31 && nt.fiber_g.goal === 39 && nt.carbs_g.goal === 280, 'יעדי תזונה לפי משקל ויעד קלוריות שהוגדרו', JSON.stringify(nt));
  const gn1 = nutritionTargets({ weight_kg: 68, height_cm: 175 }), gn2 = nutritionTargets({ weight_kg: 68, height_cm: 175, goal: 'maintain' });
  ok(gn1.goal === 'muscle_gain' && gn1.kcal.goal === 2640 && gn2.kcal.goal === 2390 && gn1.protein_g.goal === 122, 'מטרת בניית שריר מוסיפה 250 קק״ל להערכה, ושמירה לא', JSON.stringify([gn1.kcal, gn2.kcal]));
  ok((await call('/api/profile', { method: 'PUT', cookie, body: { goal: 'bulk' } })).status === 400, 'מטרה לא מוכרת נדחית');
  ok((await call('/api/profile', { method: 'PUT', cookie, body: { weight_kg: 300 } })).status === 400 && (await call('/api/profile', { method: 'PUT', cookie, body: { kcal_target: 500 } })).status === 400, 'משקל או יעד קלוריות לא סבירים נדחים');
  ok((await call(`/api/meals/${mcj.id}`, { method: 'DELETE', cookie })).status === 200 && (await call(`/api/meals/${mcj.id}`, { method: 'DELETE', cookie })).status === 404, 'מחיקת ארוחה, ומחיקה חוזרת מחזירה 404');
  ok((await call('/api/meals/not-a-uuid', { method: 'DELETE', cookie })).status === 404, 'מזהה לא תקין מחזיר 404');

  /* 11ח. אימונים ובדיקת בוקר */
  const wk = await call('/api/workouts', { method: 'POST', cookie, body: { date: TODAY, time: '18:30', duration_min: 55, type: 'weights', rpe: 8, note: 'רגליים' } });
  const wkj = await wk.json();
  ok(wk.status === 201, 'אימון נשמר');
  ok((await call('/api/workouts', { method: 'POST', cookie, body: { date: TODAY, time: '18:30', duration_min: 2, type: 'weights' } })).status === 400, 'אימון קצר מדי נדחה');
  ok((await call('/api/workouts', { method: 'POST', cookie, body: { date: TODAY, time: '18:30', duration_min: 30, type: 'yoga' } })).status === 400, 'סוג אימון לא מוכר נדחה');
  ok((await call('/api/workouts', { method: 'POST', cookie, body: { date: TODAY, time: '18:30', duration_min: 30, type: 'cardio', rpe: 11 } })).status === 400, 'מאמץ מעל 10 נדחה');
  const wl = (await (await call('/api/workouts?days=7', { cookie })).json()).workouts;
  ok(wl.length === 1 && wl[0].type === 'weights' && wl[0].rpe === 8 && wl[0].duration_min === 55 && wl[0].local_time === '18:30', 'רשימת אימונים');
  ok((await call('/api/checkin', { method: 'PUT', cookie, body: { rested: 4 } })).status === 200, 'בדיקת בוקר נשמרת');
  ok((await call('/api/checkin', { method: 'PUT', cookie, body: { rested: 9 } })).status === 400 && (await call('/api/checkin', { method: 'PUT', cookie, body: {} })).status === 400, 'בדיקת בוקר לא תקינה נדחית');
  const ck = (await (await call(`/api/day?date=${TODAY}`, { cookie })).json());
  ok(ck.checkin && ck.checkin.rested === 4 && ck.workouts.length === 1, 'סיכום יום כולל בדיקת בוקר ואימון');
  ok((await call(`/api/workouts/${wkj.id}`, { method: 'DELETE', cookie })).status === 200 && (await call(`/api/workouts/${wkj.id}`, { method: 'DELETE', cookie })).status === 404, 'מחיקת אימון, ומחיקה חוזרת מחזירה 404');

  /* 11ט. המאמן: יחידות */
  const { coachEnabled, coachDate } = await import('../src/coach.js');
  const { guardReply, redFlag, MED_LINE } = await import('../src/safety.js');
  ok(coachEnabled({ GEMINI_API_KEY: 'k', GEMINI_TIER: 'paid' }) && coachEnabled({ GEMINI_API_KEY: 'k', GEMINI_TIER: 'free' }) && !coachEnabled({ GEMINI_API_KEY: 'k' }) && !coachEnabled({ GEMINI_TIER: 'paid' }) && !coachEnabled({ GEMINI_API_KEY: 'k', GEMINI_TIER: 'yes' }), 'המאמן מופעל רק כשיש מפתח והוצהרה שכבה (paid או free)');
  ok(coachDate(new Date('2026-09-30T00:30:00Z')) === '2026-09-29' && coachDate(new Date('2026-09-30T01:30:00Z')) === '2026-09-30' && coachDate(new Date('2026-11-01T01:30:00Z')) === '2026-10-31' && coachDate(new Date('2026-11-01T02:30:00Z')) === '2026-11-01', 'יום המאמן מתחיל ב-04:00 שעון ישראל, גם בשעון חורף');
  ok(redFlag('יש לי כאב בחזה ואני לא ישן').kind === 'emergency' && redFlag('התעלפתי אתמול').kind === 'emergency' && redFlag('שתן כהה מהבוקר').kind === 'muscle' && redFlag('איך ישנתי הלילה?') === null && redFlag('קפה בשעה ארבע') === null, 'סימני אזהרה מזוהים, ושאלה רגילה לא');
  const g1 = guardReply('כדאי להפסיק את הסטטין לכמה ימים ולראות אם השינה משתפרת');
  ok(g1.text.includes(MED_LINE) && g1.flags[0] === 'med_line_added', 'תשובה שמזכירה שינוי תרופה מקבלת שורת בטיחות קבועה');
  const g2 = guardReply('לישון טוב יותר עוזר. כדאי להירדם בשעה קבועה, ולהגביל קפה אחרי הצהריים.');
  ok(g2.flags.length === 0 && g2.text.startsWith('לישון טוב'), 'תשובה בלי תרופות לא משתנה');

  /* 11י. המאמן: שער עדכניות, פתיחה יומית ושיחה */
  const state = async () => (await rfetch(`http://127.0.0.1:${MOCK_PORT}/__state`)).json();
  const resetThreads = () => { d1('DELETE FROM chat_message'); d1('DELETE FROM chat_thread'); };
  for (const p of ['/api/coach/status', '/api/coach/threads']) ok((await call(p)).status === 401, `${p} בלי התחברות מחזיר 401`);
  ok((await call('/api/coach/start', { method: 'POST' })).status === 401, 'פתיחת יום בלי התחברות מחזירה 401');
  const cs = await (await call('/api/coach/status', { cookie })).json();
  ok(cs.usage30 && cs.usage30.calls > 0 && cs.usage30.tokens_in > 0 && cs.usage30.tokens_out > 0 && cs.usage30.usd >= 0, 'סטטוס המאמן כולל שימוש ב-30 הימים האחרונים: קריאות, טוקנים ועלות משוערת', JSON.stringify(cs.usage30));
  ok(cs.enabled === true && cs.tier === 'paid' && cs.dailyCap === 400, 'סטטוס המאמן: מופעל, שכבה paid ותקרה יומית', JSON.stringify(cs));

  resetThreads();
  const cdate = coachDate();
  let n0 = (await state()).gemini.length;
  const st1 = await call('/api/coach/start', { method: 'POST', cookie });
  const s1 = await st1.json();
  ok(st1.status === 200 && s1.gate.state === 'ok' && s1.gate.sleepForToday === true && s1.messages.length === 1 && s1.messages[0].role === 'assistant', 'פתיחת יום: שער עדכניות תקין ופתיחה אחת', JSON.stringify(s1).slice(0, 300));
  ok(JSON.stringify(s1.messages[0].meta.quick_replies) === JSON.stringify(['למה זה קרה?', 'מה הכי חשוב היום?']) && s1.messages[0].meta.opener === true, 'תשובות מהירות נשמרו עם הפתיחה');
  const opCalls = (await state()).gemini.slice(n0);
  ok(opCalls.length === 1, 'הפתיחה עלתה בקריאה אחת ל-Gemini');
  const sys = opCalls[0].body.systemInstruction.parts[0].text;
  ok(sys.includes('מאמן שינה') && sys.includes('לעולם לא מייעצים') && sys.includes('avg_asleep_h_7d') && sys.includes(cdate) && !sys.includes('deep_min') && !/[—–]/.test(sys), 'ההנחיה כוללת עקרונות, כללי בטיחות ונתונים עדכניים, בלי דקות שינה עמוקה ובלי מקף ארוך', sys.slice(-400));
  ok(opCalls[0].body.generationConfig.responseMimeType === 'application/json' && opCalls[0].body.store === false && opCalls[0].body.generationConfig.thinkingConfig.thinkingLevel === 'LOW' && !opCalls[0].body.contents[0].parts[0].text.includes('עוד לא הגיעו'), 'בקשת פתיחה: JSON, store:false, חשיבה LOW, והנתונים הגיעו');

  n0 = (await state()).gemini.length;
  const s1b = await (await call('/api/coach/start', { method: 'POST', cookie })).json();
  ok(s1b.messages.length === 1 && s1b.messages[0].id === s1.messages[0].id && (await state()).gemini.length === n0, 'פתיחה שנייה באותו יום מחזירה את אותה פתיחה בלי קריאה נוספת ל-Gemini');

  resetThreads();
  const [pa, pb] = await Promise.all([call('/api/coach/start', { method: 'POST', cookie }), call('/api/coach/start', { method: 'POST', cookie })]);
  const pcodes = [pa.status, pb.status].sort().join();
  const thc = await (await call(`/api/coach/thread?date=${cdate}`, { cookie })).json();
  ok(thc.messages.length === 1 && (pcodes === '200,200' || pcodes === '200,202'), 'שני מכשירים שנפתחים יחד יוצרים פתיחה אחת בלבד', pcodes + ' ' + thc.messages.length);

  // המתנה לשעון: הנתונים של הלילה עוד לא הגיעו
  resetThreads(); d1('DELETE FROM sleep_session'); d1('UPDATE gh_connection SET last_sync_at = 0');
  await ctl({ sleepEmpty: true });
  const w = await (await call('/api/coach/start', { method: 'POST', cookie })).json();
  ok(w.gate.state === 'waiting_for_watch' && w.gate.sleepForToday === false && w.gate.synced === true && w.messages.length === 0, 'שער עדכניות: נתוני הלילה לא הגיעו, לא נוצרת פתיחה ומוצג מצב המתנה', JSON.stringify(w.gate));
  n0 = (await state()).gemini.length;
  ok((await state()).gemini.length === n0 && (await (await call('/api/coach/thread?date=' + cdate, { cookie })).json()).messages.length === 0, 'במצב המתנה אין קריאה ל-Gemini ואין הודעות');
  const forced = await (await call('/api/coach/start', { method: 'POST', cookie, body: { force: true } })).json();
  const fcall = (await state()).gemini.at(-1);
  ok(forced.messages.length === 1 && fcall.body.contents[0].parts[0].text.includes('עוד לא הגיעו'), 'המשך בלי נתוני הלילה יוצר פתיחה שאומרת שהנתונים חסרים');
  await ctl({ sleepEmpty: false });
  ok((await call('/api/gh/sync', { method: 'POST', cookie })).status === 200, 'סנכרון מחדש מחזיר את נתוני הלילה');

  // כשל ב-Gemini משחרר את הנעילה
  resetThreads();
  await ctl({ geminiStatus: 429 });
  const f429 = await call('/api/coach/start', { method: 'POST', cookie });
  ok(f429.status === 429 && (await f429.json()).error === 'gemini_quota' && d1('SELECT opener_status FROM chat_thread')[0].opener_status === 'none', 'מכסה מלאה בפתיחה: 429 והנעילה משתחררת');
  await ctl({ geminiStatus: 200 });
  const retry = await call('/api/coach/start', { method: 'POST', cookie });
  ok(retry.status === 200 && (await retry.json()).messages.length === 1, 'ניסיון חוזר אחרי כשל מצליח');

  // הודעות
  ok((await call('/api/coach/message', { method: 'POST', cookie, body: { text: '' } })).status === 400 && (await call('/api/coach/message', { method: 'POST', cookie, body: { text: 'א'.repeat(1500) } })).status === 400, 'הודעה ריקה או ארוכה מדי נדחית');
  n0 = (await state()).gemini.length;
  const mb = await call('/api/coach/message', { method: 'POST', cookie, body: { text: 'איך ישנתי השבוע?' } });
  const mj = await mb.json();
  ok(mb.status === 200 && mj.message.role === 'assistant' && /לפי \d+ לילות/.test(mj.message.text) && mj.message.meta.tool_steps === 1, 'הודעה: לולאת כלים מלאה והתשובה מבוססת על תוצאת הכלי', JSON.stringify(mj));
  const chatCalls = (await state()).gemini.slice(n0).filter((x) => x.body.tools);
  const lastFr = chatCalls.at(-1).body.contents.at(-1).parts[0].functionResponse;
  ok(chatCalls.length === 2 && lastFr.name === 'get_nights' && lastFr.id === 'fc_1' && lastFr.response.result.nights.length === 1 && lastFr.response.result.stats.nights_available === 1, 'הכלי get_nights רץ על נתונים עדכניים מהמסד ותוצאתו הוחזרה למודל');
  const roles = chatCalls[0].body.contents.map((c) => c.role);
  ok(roles[0] === 'user' && roles[1] === 'model' && roles[2] === 'user', 'ההיסטוריה מתחילה בתור של המשתמש, אחריו הפתיחה של המאמן, אחריו ההודעה', roles.join());
  ok(!chatCalls[0].body.tools[0].functionDeclarations.some((f) => /write|add|delete|create|save/i.test(f.name)), 'כלי המאמן הם לקריאה בלבד');

  // סימני אזהרה: תשובה קבועה בלי קריאה למודל
  n0 = (await state()).gemini.length;
  const rf = (await (await call('/api/coach/message', { method: 'POST', cookie, body: { text: 'יש לי כאב בחזה' } })).json()).message;
  ok(rf.meta.red_flag === 'emergency' && rf.text.includes('שירותי חירום') && (await state()).gemini.length === n0, 'סימן אזהרה: תשובת חירום קבועה בלי קריאה למודל');
  const rm = (await (await call('/api/coach/message', { method: 'POST', cookie, body: { text: 'יש לי שתן כהה וכאב שרירים חזק' } })).json()).message;
  ok(rm.meta.red_flag === 'muscle' && rm.text.includes('עוד היום') && !/להפסיק את הסטטין/.test(rm.text), 'אזהרת שרירים: פנייה לרופא.ה היום, בלי עצה לשנות תרופה');

  // רשת ביטחון: תשובת מודל שמציעה לשנות תרופה מקבלת שורת בטיחות
  await ctl({ geminiReply: 'כדאי להפסיק את הסטטין לכמה ימים ולראות אם השינה משתפרת' });
  const gm = (await (await call('/api/coach/message', { method: 'POST', cookie, body: { text: 'מה דעתך על הסטטין?' } })).json()).message;
  ok(gm.text.includes(MED_LINE) && gm.meta.flags.includes('med_line_added'), 'תשובת מודל שמציעה לשנות תרופה מקבלת שורת בטיחות קבועה');
  await ctl({ geminiReply: null });

  // כשל במהלך הודעה לא משאיר הודעת משתמש תלויה
  const before = (await (await call(`/api/coach/thread?date=${cdate}`, { cookie })).json()).messages.length;
  await ctl({ geminiStatus: 429 });
  ok((await call('/api/coach/message', { method: 'POST', cookie, body: { text: 'שאלה שתיכשל' } })).status === 429, 'מכסה מלאה בהודעה מחזירה 429');
  await ctl({ geminiStatus: 200 });
  ok((await (await call(`/api/coach/thread?date=${cdate}`, { cookie })).json()).messages.length === before, 'הודעת משתמש שנכשלה נמחקת, כדי שניסיון חוזר לא ישכפל אותה');

  // היסטוריה ושיחות קודמות
  const thr = await (await call('/api/coach/threads', { cookie })).json();
  ok(thr.threads.length >= 1 && thr.threads[0].coach_date === cdate && thr.threads[0].messages >= 5 && thr.threads[0].preview.length > 0, 'רשימת שיחות כוללת את היום עם תצוגה מקדימה');
  ok((await call('/api/coach/thread?date=2020-01-01', { cookie })).status === 404 && (await call('/api/coach/thread?date=bad', { cookie })).status === 400, 'שיחה שלא קיימת 404, תאריך לא תקין 400');

  // תקרה יומית
  d1('UPDATE gemini_usage SET calls = 9999');
  const cap1 = await call('/api/meals/analyze', { method: 'POST', cookie, body: { text: 'x' } });
  const cap2 = await call('/api/coach/message', { method: 'POST', cookie, body: { text: 'עוד שאלה' } });
  ok(cap1.status === 429 && (await cap1.json()).error === 'daily_cap' && cap2.status === 429, 'תקרת קריאות יומית חוסמת גם ניתוח ארוחה וגם שיחה');
  d1('UPDATE gemini_usage SET calls = 0');
  ok((await call('/api/meals/analyze', { method: 'POST', cookie, body: { text: 'x' } })).status === 200, 'אחרי איפוס התקרה הקריאות חוזרות לעבוד');

  /* 11י2. תובנות יומיות וספריית "למה ככה?" */
  const { CATALOG } = await import('../src/evidence/catalog.js');
  const CAT_IDS = CATALOG.map((t) => t.id);
  const libRes = await call('/evidence/library.json');
  const libj = await libRes.json();
  ok(libRes.status === 200 && (libRes.headers.get('content-type') || '').includes('json') && libj.topics.length === CAT_IDS.length && libj.topics.every((t) => t.sources.length >= 1 && t.sources.every((x) => x.url.startsWith('https://')) && t.videos.length <= 3), 'ספריית "למה ככה?" מוגשת כקובץ סטטי: כל נושא עם מקורות בכתובות https ולא יותר משלושה סרטונים', libRes.status);
  ok(!/[—–]/.test(JSON.stringify(libj)), 'הספרייה בלי מקף ארוך או בינוני');
  const { extractWhy } = await import('../src/coach.js');
  const ew = extractWhy('שורה ראשונה.\n\n[[למה: caffeine_timing, invented, alcohol_sleep_hrv, sleep_regularity, exercise_timing_evening]]\n', new Set(CAT_IDS));
  ok(ew.text === 'שורה ראשונה.' && JSON.stringify(ew.topics) === '["caffeine_timing","alcohol_sleep_hrv","sleep_regularity"]', 'חילוץ נושאים מהתשובה: הסימון נחתך, מזהים לא קיימים נזרקים, ולא יותר משלושה', JSON.stringify(ew));
  ok(extractWhy('בלי סימון').topics.length === 0 && extractWhy('א [[why: sleep_regularity]] ב').text === 'א ב', 'תשובה בלי סימון ללא נושאים, וסימון באמצע טקסט נחתך');

  ok((await call('/api/insights/today')).status === 401, '/api/insights/today בלי התחברות מחזיר 401');
  const fbUrl = '/api/insights/feedback';
  ok((await call(fbUrl, { method: 'POST', body: { id: `${COACH_TODAY}:research`, action: 'known' } })).status === 401, 'משוב על תובנה בלי התחברות מחזיר 401');
  d1('DELETE FROM insight_card'); d1('DELETE FROM insight_day');
  const it1 = await (await call('/api/insights/today', { cookie })).json();
  const laneOf = (j, l) => j.cards.find((c) => c.lane === l);
  ok(it1.date === COACH_TODAY && it1.hasSleep === true && it1.cards.length >= 3 && it1.cards.every((c) => c.id === `${COACH_TODAY}:${c.lane}` && c.title && c.body && c.emoji && c.label), 'תובנות היום: כרטיסים עם מזהה, כותרת, גוף ותווית, ולילה קיים', JSON.stringify(it1.cards.map((c) => c.lane)));
  const resC = laneOf(it1, 'research'), mvc = laneOf(it1, 'move');
  ok(resC && resC.topics.length === 1 && CAT_IDS.includes(resC.topics[0]) && resC.data.strength, 'מחקר היום: נושא מהספרייה המאומתת וחוזק ראיות', JSON.stringify(resC));
  ok(mvc && mvc.key === 'move:fixed_wake' && mvc.body.includes('06:30') && mvc.data.day === 1, 'צעד קטן: מיקוד השכמה קבועה לפי שעת ההשכמה בפרופיל, יום 1', JSON.stringify(mvc));
  ok(!/[—–]/.test(JSON.stringify(it1)), 'תובנות: בלי מקף ארוך');
  const it2 = await (await call('/api/insights/today', { cookie })).json();
  ok(JSON.stringify(it2.cards.map((c) => [c.id, c.title, c.body])) === JSON.stringify(it1.cards.map((c) => [c.id, c.title, c.body])) && d1('SELECT COUNT(*) AS n FROM insight_card')[0].n === it1.cards.length, 'רענון לא משנה את הכרטיסים ולא מכפיל שורות');

  const fbOf = (id) => d1(`SELECT feedback FROM insight_card WHERE id = '${id}'`)[0].feedback;
  ok((await call(fbUrl, { method: 'POST', cookie, body: { id: resC.id, action: 'known' } })).status === 200 && fbOf(resC.id) === 'known', 'משוב "כבר ידעתי" נשמר');
  ok((await call(fbUrl, { method: 'POST', cookie, body: { id: resC.id, action: 'clear' } })).status === 200 && fbOf(resC.id) === null, 'ניקוי משוב');
  ok((await call(fbUrl, { method: 'POST', cookie, body: { id: resC.id, action: 'love' } })).status === 400 && (await call(fbUrl, { method: 'POST', cookie, body: { id: `${COACH_TODAY}:weekly`, action: 'known' } })).status === 400 && (await call(fbUrl, { method: 'POST', cookie, body: { id: 'x', action: 'known' } })).status === 400, 'משוב לא תקין (פעולה לא מוכרת, סיכום שבוע, מזהה שגוי) נדחה');
  ok((await call(fbUrl, { method: 'POST', cookie, body: { id: '2020-01-01:look', action: 'known' } })).status === 404, 'משוב על כרטיס שלא קיים מחזיר 404');

  const gen0 = d1('SELECT generated_at FROM insight_day')[0].generated_at;
  await sleep(1100);
  d1('UPDATE insight_day SET has_sleep = 0');
  await call('/api/insights/today', { cookie });
  const day1 = d1('SELECT has_sleep, generated_at FROM insight_day')[0];
  ok(day1.has_sleep === 1 && day1.generated_at > gen0, 'יום שהורכב לפני שנתוני הלילה הגיעו מורכב מחדש כשהם מגיעים');
  const resC2 = laneOf(await (await call('/api/insights/today', { cookie })).json(), 'research');
  await call(fbUrl, { method: 'POST', cookie, body: { id: resC2.id, action: 'more' } });
  const gen1 = d1('SELECT generated_at FROM insight_day')[0].generated_at;
  await sleep(1100);
  d1(`UPDATE insight_day SET notes_json = '{"sig":"old"}'`);
  const resC3 = laneOf(await (await call('/api/insights/today', { cookie })).json(), 'research');
  ok(d1('SELECT generated_at FROM insight_day')[0].generated_at === gen1 && resC3.feedback === 'more', 'אחרי משוב, שינוי בלילה לא מוחק את הכרטיסים הקיימים');
  await call(fbUrl, { method: 'POST', cookie, body: { id: resC2.id, action: 'clear' } });
  await sleep(1100);
  await call('/api/insights/today', { cookie });
  ok(d1('SELECT generated_at FROM insight_day')[0].generated_at > gen1 && JSON.parse(d1('SELECT notes_json FROM insight_day')[0].notes_json).sig !== 'old', 'בלי משוב, שינוי בחתימת הלילה (קטע שינה נוסף) מרכיב את היום מחדש');

  // המאמן: נושאי "למה ככה?" בפתיחה ובשיחה, והתובנות של היום כהקשר
  resetThreads();
  n0 = (await state()).gemini.length;
  const tp = await (await call('/api/coach/start', { method: 'POST', cookie })).json();
  const tcall = (await state()).gemini.slice(n0)[0];
  const tsys = tcall.body.systemInstruction.parts[0].text;
  const tenum = tcall.body.generationConfig.responseJsonSchema.properties.topics.items.enum;
  ok(tenum.length === CAT_IDS.length && tsys.includes('[[למה:') && tsys.includes('sleep_regularity:') && tsys.includes('insights_today'), 'הפתיחה: סכמה עם רשימת נושאים סגורה, והנחיה לצטט מזהים בלבד');
  ok(JSON.stringify(tp.messages[0].meta.topics) === JSON.stringify([tenum[0]]), 'מזהה נושא שהמודל המציא נזרק ומזהה תקין נשמר', JSON.stringify(tp.messages[0].meta.topics));
  const stackNow = await (await call('/api/insights/today', { cookie })).json();
  ok(tsys.includes('"insights_today":[{') && tsys.includes(stackNow.cards[0].title.slice(0, 10)) && !/[—–]/.test(tsys), 'התובנות של היום נשלחות למאמן כהקשר, כדי שלא יחזור עליהן');
  await ctl({ geminiReply: 'ערב אחרי 16:00 כדאי לצמצם קפה.\n[[למה: caffeine_timing, made_up_topic]]' });
  const tm = (await (await call('/api/coach/message', { method: 'POST', cookie, body: { text: 'מה עם הקפה?' } })).json()).message;
  ok(tm.text === 'ערב אחרי 16:00 כדאי לצמצם קפה.' && JSON.stringify(tm.meta.topics) === '["caffeine_timing"]', 'שיחה: הסימון [[למה: ...]] נחתך מהטקסט ורק מזהים קיימים נשמרים', JSON.stringify(tm));
  await ctl({ geminiReply: null });

  /* 11יא. לילה מפוצל לשני קטעים: מאוחד ללילה אחד כמו ב-Google Health (מקרה אמיתי מהחיבור הראשון) */
  await ctl({ splitNight: true });
  d1('DELETE FROM sleep_session');
  ok((await (await call('/api/gh/sync', { method: 'POST', cookie, body: { days: 3 } })).json()).sleepSessions === 2, 'סנכרון של לילה מפוצל שומר שני קטעים');
  const splitN = (await (await call('/api/gh/last-night', { cookie })).json()).night;
  ok(splitN.bed === '00:03' && splitN.wake === '08:39' && splitN.minutes_asleep === 386 && splitN.minutes_in_period === 516 && splitN.gap_min === 107, 'לילה מפוצל: הירדמות 00:03, השכמה 08:39, שינה 6:26, במיטה 8:36 (כמו Google Health)', JSON.stringify([splitN.bed, splitN.wake, splitN.minutes_asleep, splitN.minutes_in_period, splitN.gap_min]));
  ok(splitN.stages.deep === 114 && splitN.stages.light === 185 && splitN.stages.rem === 87 && splitN.stages.awake === 130 && splitN.segments.length === 2 && splitN.night_date === COACH_TODAY, 'לילה מפוצל: שלבים מסוכמים (עמוקה 1:54, קלה 3:05, REM 1:27) וערות 2:10 כולל הפער, ושני קטעים', JSON.stringify(splitN.stages));
  await ctl({ splitNight: false });
  d1('DELETE FROM sleep_session');
  ok((await (await call('/api/gh/sync', { method: 'POST', cookie })).json()).ok, 'חזרה ללילה רגיל אחרי המקרה המפוצל');

  /* 12. ניתוק ויציאה */
  ok((await (await call('/api/gh/disconnect', { method: 'POST', cookie })).json()).ok && (await statusOf(cookie)).status === 'disconnected', 'ניתוק מנקה את החיבור');
  ok(!(d1('SELECT refresh_sealed, health_user_id FROM gh_connection WHERE id = 1')[0].refresh_sealed), 'ניתוק מוחק את הטוקן מהמסד');

  // כשל בהחלפת הקוד מול גוגל: הסיבה שגוגל החזירה מועברת לממשק ונשמרת, כדי שאפשר יהיה לדעת מה לתקן
  await ctl({ forceTokenError: 'invalid_client' });
  const exc = await connectFlow(cookie);
  ok(exc.location.startsWith(`${APP}/?gh=exchange_failed&why=invalid_client&hint=secret_short&len=`), 'כשל בהחלפת הקוד: קוד השגיאה של גוגל (invalid_client) ורמז על צורת הסוד מועברים לממשק', exc.location);
  ok(/^exchange_failed:invalid_client:secret_short:\d+$/.test((await statusOf(cookie)).lastError) && (await statusOf(cookie)).status === 'disconnected', 'הסיבה והרמז נשמרים במסד ומוצגים גם אחרי רענון', (await statusOf(cookie)).lastError);
  await ctl({ forceTokenError: 'not a safe code!' });
  ok((await connectFlow(cookie)).location === `${APP}/?gh=exchange_failed&why=unknown`, 'קוד שגיאה לא תקין מוחלף ב-unknown ולא מועבר לממשק');
  await ctl({ forceTokenError: null });
  const exw = await connectFlow(cookie, (s) => `code=wrongcode&state=${s}`);
  ok(exw.location === `${APP}/?gh=exchange_failed&why=invalid_grant`, 'קוד שגוי מחזיר invalid_grant', exw.location);
  await ctl({ identityStatus: 403 });
  ok((await connectFlow(cookie)).location === `${APP}/?gh=identity_failed&why=http_403` && (await statusOf(cookie)).lastError === 'identity_failed:http_403', 'כשל בזיהוי (403) נשמר כסיבה אחרונה כשאין חיבור');
  await ctl({ identityStatus: 200 });
  ok((await connectFlow(cookie)).location === `${APP}/?gh=connected` && (await statusOf(cookie)).lastError == null, 'חיבור מוצלח מנקה את השגיאה האחרונה');
  ok((await call('/api/gh/selftest')).status === 401, 'בדיקת פרטי הלקוח דורשת התחברות');
  const stOk = await (await call('/api/gh/selftest', { cookie })).json();
  ok(stOk.configured === true && stOk.clientOk === true && stOk.error === 'invalid_grant' && stOk.clientId === CLIENT_ID && !JSON.stringify(stOk).includes(CLIENT_SECRET), 'בדיקה עצמית: פרטי לקוח תקינים (גוגל דוחה רק את הקוד המזויף), בלי לחשוף את הסוד', JSON.stringify(stOk));
  await ctl({ forceTokenError: 'invalid_client' });
  const stBad = await (await call('/api/gh/selftest', { cookie })).json();
  ok(stBad.clientOk === false && stBad.error === 'invalid_client' && stBad.hint === 'secret_short' && stBad.secLen === CLIENT_SECRET.length && !JSON.stringify(stBad).includes(CLIENT_SECRET), 'בדיקה עצמית: לקוח נדחה מחזיר רמז על אורך הסוד בלבד', JSON.stringify(stBad));
  await ctl({ forceTokenError: null });
  await ctl({ forceTokenError: 'invalid_client' });
  ok((await connectFlow(cookie)).location.startsWith(`${APP}/?gh=exchange_failed&why=invalid_client`) && (await statusOf(cookie)).status === 'connected' && (await statusOf(cookie)).lastError == null, 'כשל בחיבור מחדש לא משבש חיבור קיים ותקין');
  await ctl({ forceTokenError: null });
  const second = await login();
  ok((await call('/api/logout-all', { method: 'POST', cookie: second.cookie })).status === 200, 'יציאה מכל המכשירים');
  ok((await call('/api/me', { cookie: second.cookie })).status === 401 && (await call('/api/me', { cookie })).status === 401, 'אחרי יציאה מכל המכשירים כל העוגיות פסולות');
}

main().catch((e) => { fail++; console.error('FAIL בדיקות קרסו:', e.stack || e); }).finally(async () => {
  try { dev && dev.kill('SIGTERM'); } catch { /* ignore */ }
  try { mock && mock.close(); } catch { /* ignore */ }
  await sleep(500);
  try { rmSync(persist, { recursive: true, force: true }); } catch { /* ignore */ }
  console.log(`\nסיכום: ${pass} עברו, ${fail} נכשלו`);
  process.exit(fail ? 1 : 0);
});
