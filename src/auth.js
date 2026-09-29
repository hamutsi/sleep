// התחברות יחידה עם ביטוי סיסמה. סודות: SESSION_SECRET, LOGIN_PEPPER, PASS_VERIFIER.
// PASS_VERIFIER = base64url(HMAC-SHA256(LOGIN_PEPPER, 'login:' + normalize(passphrase))), מחושב מקומית ב-set-secrets.sh.
// אי אפשר להריץ אלגוריתם הצפנה כבד (PBKDF2, scrypt) ב-Worker בחבילה החינמית (10ms CPU), לכן: ביטוי ארוך, אימות HMAC, והגבלת ניסיונות.
// בסיס: הקוד שכתב סוכן המחקר C, אחרי בדיקה. שינוי: SameSite=Lax כדי שהחזרה מגוגל תישא את העוגייה.
import { b64u, enc, dec, now } from './util.js';
import { json, csrfOk, getCookie } from './http.js';

const COOKIE = '__Host-sc';
const DAY = 86400;
const IDLE = 180 * DAY;       // תוקף מתחדש בכל שימוש
const ABS = 365 * DAY;        // תוקף מוחלט
const REFRESH_AFTER = DAY;

export const normalize = (s) => String(s).normalize('NFKC').trim();

const hmac = async (secret, msg) => {
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
};
// timingSafeEqual הוא הרחבה של Workers וזורק כשהאורכים שונים, ולכן בודקים אורך קודם
const same = (a, b) => a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);

const cookieHeader = (token, maxAge = IDLE) => `${COOKIE}=${token}; Max-Age=${maxAge}; Path=/; Secure; HttpOnly; SameSite=Lax`;

export const configured = (env) => !!(env.SESSION_SECRET && env.LOGIN_PEPPER && env.PASS_VERIFIER && env.DB);

async function mint(env, v, iat, ts = iat) {
  const p = b64u.enc(enc.encode(JSON.stringify({ v, iat, ts })));
  return `${p}.${b64u.enc(await hmac(env.SESSION_SECRET, 'sc1.' + p))}`;
}

// מחזיר null (לא מחובר) או { refresh: ערך Set-Cookie | null } לתוקף מתחדש
export async function session(req, env) {
  if (!env.SESSION_SECRET) return null;
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
  if (!configured(env)) return json({ error: 'not_configured' }, 503);
  if (!csrfOk(req)) return json({ error: 'forbidden' }, 403);
  const body = await req.json().catch(() => null);
  const pass = typeof body?.passphrase === 'string' ? normalize(body.passphrase) : '';
  if (!pass || pass.length > 256) return json({ error: 'invalid' }, 400);
  const t = now();
  // סופרים את הניסיון קודם, אטומית, ורק אם לא נעול: 5 ניסיונות חופשיים, אחר כך 30 שניות, 60, ... עד 900
  const [upd, cur] = await env.DB.batch([
    env.DB.prepare(
      `UPDATE auth_state SET fails = fails + 1,
         locked_until = CASE WHEN fails + 1 >= 5 THEN ?1 + MIN(900, 30 * (1 << MIN(fails + 1 - 5, 5))) ELSE 0 END
       WHERE id = 1 AND locked_until <= ?1`).bind(t),
    env.DB.prepare('SELECT session_version AS v, locked_until FROM auth_state WHERE id = 1'),
  ]);
  if (!upd.meta.changes) {
    const wait = Math.max(1, (cur.results[0]?.locked_until ?? t) - t);
    return json({ error: 'locked', retry_after: wait }, 429, { 'retry-after': String(wait) });
  }
  const row = cur.results[0];
  const ok = same(await hmac(env.LOGIN_PEPPER, 'login:' + pass), b64u.dec(env.PASS_VERIFIER));
  if (!ok) return json({ error: 'invalid_credentials' }, 401);
  await env.DB.prepare('UPDATE auth_state SET fails = 0, locked_until = 0 WHERE id = 1').run();
  return json({ ok: true }, 200, { 'set-cookie': cookieHeader(await mint(env, row.v, t)) });
}

export const logout = () => json({ ok: true }, 200, { 'set-cookie': cookieHeader('', 0) });

// מעלה את הגרסה: כל עוגייה קיימת מתה בבקשה הבאה
export async function logoutAll(env) {
  await env.DB.prepare('UPDATE auth_state SET session_version = session_version + 1 WHERE id = 1').run();
  return logout();
}
