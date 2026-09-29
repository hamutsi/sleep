// לקוח ל-Google Health API v4 (health.googleapis.com). REST, JSON, בלי SDK.
// כללים חשובים מהמסמכים: הנתיב ב-kebab-case והפילטר ב-snake_case, פילטר AIP-160 עם >= ו-< ו-AND בלבד,
// גודל עמוד לשינה עד 25, מספרים של 64 ביט מגיעים כמחרוזות.
import { ensureAccessToken, apiBase } from './oauth.js';
import { GhError } from './errors.js';

const query = (params) =>
  Object.entries(params || {}).filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');

export async function ghGet(env, path, params) {
  let token = await ensureAccessToken(env);
  for (let attempt = 0; attempt < 2; attempt++) {
    const qs = query(params);
    const r = await fetch(`${apiBase(env)}${path}${qs ? '?' + qs : ''}`, { headers: { authorization: `Bearer ${token}`, accept: 'application/json' } });
    if (r.status === 401 && attempt === 0) { token = await ensureAccessToken(env, true); continue; }
    const text = await r.text();
    let j = null;
    try { j = JSON.parse(text); } catch { /* לא JSON */ }
    if (!r.ok) throw new GhError((j && j.error && j.error.status) || `http_${r.status}`, r.status, ((j && j.error && j.error.message) || text).slice(0, 300));
    return j;
  }
  throw new GhError('unauthorized', 401);
}

// שולף נקודות נתונים עם עימוד. reconcile=true נותן זרם מנוכה כפילויות.
export async function listPoints(env, type, { filter, pageSize = 100, maxPages = 3, reconcile = false, extra = {} } = {}) {
  const out = [];
  let pageToken;
  for (let i = 0; i < maxPages; i++) {
    const r = await ghGet(env, `/users/me/dataTypes/${type}/dataPoints${reconcile ? ':reconcile' : ''}`, { pageSize, filter, pageToken, ...extra });
    out.push(...((r && r.dataPoints) || []));
    pageToken = r && r.nextPageToken;
    if (!pageToken) break;
  }
  return out;
}
