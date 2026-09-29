// חיבור ל-Google Health: זרימת OAuth בצד שרת (לקוח סודי), הצפנת טוקנים, רענון.
// מסמכים: developers.google.com/health/setup, /scopes וכן developers.google.com/identity/protocols/oauth2/web-server.
import { seal, open } from '../seal.js';
import { redirect } from '../http.js';
import { now, randB64u } from '../util.js';
import { GhError } from './errors.js';

export const SCOPE_PREFIX = 'https://www.googleapis.com/auth/googlehealth';
export const SCOPES = [
  `${SCOPE_PREFIX}.sleep.readonly`,
  `${SCOPE_PREFIX}.health_metrics_and_measurements.readonly`,
  `${SCOPE_PREFIX}.activity_and_fitness.readonly`,
  `${SCOPE_PREFIX}.settings.readonly`,
];
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const tokenUrl = (env) => env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token';
const revokeUrl = (env) => env.GOOGLE_REVOKE_URL || 'https://oauth2.googleapis.com/revoke';
export const apiBase = (env) => env.GH_API_BASE || 'https://health.googleapis.com/v4';
export const redirectUri = (env) => `${env.APP_URL}/api/gh/callback`;
export const ghConfigured = (env) => !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.DATA_KEY && env.APP_URL);

export const getConn = (env) => env.DB.prepare('SELECT * FROM gh_connection WHERE id = 1').first();
const aadOf = (healthUserId) => `gh:${healthUserId}`;

// מטמון זיכרון של access token בתוך ה-isolate (משתמש יחיד). חוסך שליפה ופענוח בכל בקשה. לא נכתב ליומן ולא ל-D1 בצורה גלויה.
let mem = null;

// מזהה לקוח וסוד של גוגל הם ASCII גלוי בלבד. רווח, שורה חדשה, סימן כיווניות של עברית (RLM), רווח באורך אפס או רצפי בקרה של הדבקה מהטרמינל
// שנדבקו בטעות הם סיבה נפוצה ל-invalid_client, ולכן מסירים כל מה שאינו תו גלוי לפני כל שימוש
const clean = (v) => String(v == null ? '' : v).replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]/g, '').replace(/[^\x21-\x7E]/g, '');

// צורת הפרטים ששמורים בשרת, בלי הערכים: אורך ופורמט בלבד. עוזר להבין אם הודבק ערך חלקי, מוסתר או של שדה אחר
export function credShape(env) {
  const id = clean(env.GOOGLE_CLIENT_ID), sec = clean(env.GOOGLE_CLIENT_SECRET);
  return { idLen: id.length, idOk: /\.apps\.googleusercontent\.com$/.test(id), secLen: sec.length, secOk: sec.startsWith('GOCSPX-') && sec.length >= 30 };
}
const hintOf = (sh) => (!sh.idOk ? 'id_format' : sh.secLen < 30 ? 'secret_short' : !sh.secOk ? 'secret_format' : 'looks_ok');

async function tokenPost(env, params) {
  const r = await fetch(tokenUrl(env), {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clean(env.GOOGLE_CLIENT_ID), client_secret: clean(env.GOOGLE_CLIENT_SECRET), ...params }),
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, j };
}

// קוד השגיאה של גוגל (invalid_client, invalid_grant...) הוא לא סודי ומסביר מה לתקן. רק אותיות ו-_ עוברים הלאה לממשק
const safeWhy = (j) => { const e = j && typeof j.error === 'string' ? j.error : ''; return /^[a-z_]{3,40}$/.test(e) ? e : 'unknown'; };

const revoke = (env, token) =>
  fetch(revokeUrl(env), { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ token }) }).catch(() => null);

// שלב 1: יוצרים state חד-פעמי ומעבירים למסך ההסכמה של גוגל
export async function connectStart(env) {
  if (!ghConfigured(env)) return redirect(`${env.APP_URL}/?gh=not_configured`);
  const state = randB64u(32);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM oauth_state WHERE created_at < ?1').bind(now() - 600),
    env.DB.prepare('INSERT INTO oauth_state (state, created_at) VALUES (?1, ?2)').bind(state, now()),
  ]);
  const q = new URLSearchParams({
    client_id: clean(env.GOOGLE_CLIENT_ID),
    redirect_uri: redirectUri(env),
    response_type: 'code',
    access_type: 'offline',   // בלי זה לא מקבלים refresh token
    prompt: 'consent',        // כופה הסכמה מחדש, כדי לקבל refresh token תקף גם בחיבור חוזר
    include_granted_scopes: 'true',
    state,
    scope: SCOPES.join(' '),
  });
  return redirect(`${AUTH_URL}?${q}`);
}

// שלב 2: גוגל מחזירה לכאן עם code ו-state. ה-state הוא מה שקושר את הבקשה למי שהתחיל אותה.
export async function connectCallback(request, env) {
  const home = (q) => redirect(`${env.APP_URL}/?gh=${q}`);
  if (!ghConfigured(env)) return home('not_configured');
  const url = new URL(request.url);
  if (url.searchParams.get('error')) return home('denied');
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) return home('bad_state');
  const del = await env.DB.prepare('DELETE FROM oauth_state WHERE state = ?1 AND created_at > ?2').bind(state, now() - 600).run();
  if (!del.meta.changes) return home('bad_state');

  const { ok, status, j } = await tokenPost(env, { code, redirect_uri: redirectUri(env), grant_type: 'authorization_code' });
  if (!ok || !j.access_token) {
    const why = safeWhy(j);
    const sh = credShape(env);
    console.error('token exchange failed', status, j && j.error, j && j.error_description, JSON.stringify(sh));
    // מוסיפים רמז על צורת הפרטים ששמורים (אורך ופורמט בלבד) כשגוגל דחתה את הלקוח. נשמר גם במסד, כדי שההסבר יישאר אחרי רענון. חיבור קיים ותקין לא נפגע
    const hint = why === 'invalid_client' ? `&hint=${hintOf(sh)}&len=${sh.secLen}` : '';
    const c0 = await getConn(env);
    if (c0 && c0.status !== 'connected') await env.DB.prepare('UPDATE gh_connection SET last_error = ?1 WHERE id = 1').bind(`exchange_failed:${why}${hint ? `:${hintOf(sh)}:${sh.secLen}` : ''}`).run();
    return home(`exchange_failed&why=${why}${hint}`);
  }
  if (!j.refresh_token) return home('no_refresh_token');

  const granted = String(j.scope || '').split(/\s+/).filter(Boolean);
  if (!granted.some((s) => s.startsWith(SCOPE_PREFIX))) { await revoke(env, j.refresh_token); return home('scope_missing'); }

  const cur = await getConn(env);
  const idr = await fetch(`${apiBase(env)}/users/me/identity`, { headers: { authorization: `Bearer ${j.access_token}`, accept: 'application/json' } });
  if (idr.status === 412) {
    // אל תשבשו חיבור קיים ותקין רק בגלל ניסיון חיבור שנכשל
    if (cur.status !== 'connected') await env.DB.prepare("UPDATE gh_connection SET status = 'profile_missing', last_error = 'profile_missing' WHERE id = 1").run();
    await revoke(env, j.refresh_token);
    return home('profile_missing');
  }
  if (!idr.ok) {
    // לרוב 403: ה-API של Google Health לא הופעל בפרויקט. הקוד עובר לממשק, ופרטי השגיאה נשארים ביומן
    const eb = await idr.json().catch(() => ({}));
    console.error('identity failed', idr.status, eb && eb.error && (eb.error.status || eb.error.message));
    if (cur.status !== 'connected') await env.DB.prepare('UPDATE gh_connection SET last_error = ?1 WHERE id = 1').bind(`identity_failed:http_${idr.status}`).run();
    await revoke(env, j.refresh_token);
    return home(`identity_failed&why=http_${idr.status}`);
  }
  const identity = await idr.json().catch(() => ({}));
  const uid = identity.healthUserId;
  if (!uid) { await revoke(env, j.refresh_token); return home('identity_failed'); }

  // חשבון יחיד: אחרי החיבור הראשון מקבלים רק את אותו חשבון Google Health
  if (cur.health_user_id && cur.health_user_id !== uid) { await revoke(env, j.refresh_token); return home('wrong_account'); }

  const aad = aadOf(uid);
  const t = now();
  await env.DB.prepare(
    `UPDATE gh_connection SET status = 'connected', health_user_id = ?1, legacy_user_id = ?2, refresh_sealed = ?3, refresh_expires_at = ?4,
       access_sealed = ?5, access_expires_at = ?6, granted_scopes = ?7, connected_at = ?8, last_error = NULL WHERE id = 1`
  ).bind(
    uid, identity.legacyUserId || null, await seal(env, j.refresh_token, aad),
    j.refresh_token_expires_in ? t + Number(j.refresh_token_expires_in) : null,   // קיים רק במצב Testing (7 ימים)
    await seal(env, j.access_token, aad), t + Number(j.expires_in || 3600), granted.join(' '), t
  ).run();
  return home('connected');
}

// מחזיר access token תקף. מרענן לפי הצורך. invalid_grant אומר שצריך להתחבר מחדש.
export async function ensureAccessToken(env, force = false) {
  const c = await getConn(env);
  if (!c || c.status !== 'connected' || !c.refresh_sealed) throw new GhError('not_connected', 409);
  const aad = aadOf(c.health_user_id);
  if (!force && mem && mem.exp - now() > 120) return mem.token;
  if (!force && c.access_sealed && c.access_expires_at - now() > 120) {
    const token = await open(env, c.access_sealed, aad);
    mem = { token, exp: c.access_expires_at };
    return token;
  }

  const refresh = await open(env, c.refresh_sealed, aad);
  const { ok, j } = await tokenPost(env, { refresh_token: refresh, grant_type: 'refresh_token' });
  if (!ok || !j.access_token) {
    if (j && j.error === 'invalid_grant') {
      mem = null;
      await env.DB.prepare("UPDATE gh_connection SET status = 'needs_reauth', last_error = 'invalid_grant' WHERE id = 1").run();
      throw new GhError('needs_reauth', 401);
    }
    throw new GhError('refresh_failed', 502, j && j.error);
  }
  const t = now();
  mem = { token: j.access_token, exp: t + Number(j.expires_in || 3600) };
  const sets = ['access_sealed = ?1', 'access_expires_at = ?2'];
  const binds = [await seal(env, j.access_token, aad), t + Number(j.expires_in || 3600)];
  if (j.refresh_token) { sets.push(`refresh_sealed = ?${binds.length + 1}`); binds.push(await seal(env, j.refresh_token, aad)); }
  if (j.refresh_token_expires_in) { sets.push(`refresh_expires_at = ?${binds.length + 1}`); binds.push(t + Number(j.refresh_token_expires_in)); }
  await env.DB.prepare(`UPDATE gh_connection SET ${sets.join(', ')} WHERE id = 1`).bind(...binds).run();
  return j.access_token;
}

export async function disconnect(env) {
  mem = null;
  const c = await getConn(env);
  if (c && c.refresh_sealed) {
    try { await revoke(env, await open(env, c.refresh_sealed, aadOf(c.health_user_id))); } catch { /* מנקים בכל מקרה */ }
  }
  await env.DB.prepare(
    `UPDATE gh_connection SET status = 'disconnected', health_user_id = NULL, legacy_user_id = NULL, refresh_sealed = NULL, refresh_expires_at = NULL,
       access_sealed = NULL, access_expires_at = NULL, granted_scopes = NULL, connected_at = NULL, last_error = NULL WHERE id = 1`
  ).run();
}

// בדיקה עצמית של פרטי הלקוח: שולחים לגוגל קוד מזויף. invalid_grant אומר שגוגל הכירה בלקוח ודחתה רק את הקוד, כלומר ה-ID והסוד תקינים.
// invalid_client אומר שהם שגויים. לא צריך הסכמה ולא חיבור אמיתי, וזה הדרך המהירה לוודא שהסודות שהוזנו נכונים
export async function selftest(env) {
  if (!ghConfigured(env)) return { configured: false };
  const sh = credShape(env);
  const { status, j } = await tokenPost(env, { code: 'selftest-not-a-real-code', redirect_uri: redirectUri(env), grant_type: 'authorization_code' });
  const err = safeWhy(j);
  return {
    configured: true, clientOk: err === 'invalid_grant', error: err, httpStatus: status,
    hint: err === 'invalid_client' ? hintOf(sh) : null, idLen: sh.idLen, secLen: sh.secLen, clientId: clean(env.GOOGLE_CLIENT_ID),   // ה-Client ID אינו סודי
  };
}
