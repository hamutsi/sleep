// עזרי HTTP: תשובות JSON, כותרות אבטחה, עוגיות, הגנת CSRF.
export const json = (o, status = 200, h = {}) =>
  new Response(JSON.stringify(o), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...h },
  });

export const redirect = (url, headers = {}) =>
  new Response(null, { status: 302, headers: { location: url, 'cache-control': 'no-store', ...headers } });

export const getCookie = (req, name) =>
  (req.headers.get('cookie') || '').split(/;\s*/).map((c) => c.split(/=(.*)/s)).find(([k]) => k === name)?.[1];

// CSRF ל-API של אותו מקור: Fetch Metadata, Origin וסוג תוכן JSON בלבד (OWASP CSRF cheat sheet)
export function csrfOk(req) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;
  const site = req.headers.get('sec-fetch-site');
  if (site && !['same-origin', 'none'].includes(site)) return false;
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return false;
  return (req.headers.get('content-type') || '').startsWith('application/json');
}

// כותרות אבטחה לכל תשובה שהקוד מייצר. הקבצים הסטטיים מקבלים אותן מ-public/_headers
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
