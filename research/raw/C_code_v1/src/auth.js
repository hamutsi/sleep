// Single-user passphrase login for Workers. Secrets: SESSION_SECRET, LOGIN_PEPPER, PASS_VERIFIER.
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
