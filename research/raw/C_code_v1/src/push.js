// Minimal Web Push sender for Workers: RFC 8291 (aes128gcm) + RFC 8292 (VAPID/ES256) with Web Crypto only.
// Secrets: VAPID_PUBLIC (base64url, 65-byte uncompressed point), VAPID_PRIVATE_JWK (JSON string), VAPID_SUBJECT ("mailto:...").
const enc = new TextEncoder();
const b64u = {
  enc: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
};
const cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
const hkdf = async (salt, ikm, info, len) => new Uint8Array(await crypto.subtle.deriveBits(
  { name: 'HKDF', hash: 'SHA-256', salt, info }, await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']), len * 8));

// sub = { endpoint, keys: { p256dh, auth } } exactly as returned by PushSubscription.toJSON(). opts only for RFC test vectors.
export async function encrypt(sub, payload, opts = {}) {
  const uaPub = b64u.dec(sub.keys.p256dh), authSecret = b64u.dec(sub.keys.auth);
  const as = opts.asKeys || await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', as.publicKey));
  const ua = await crypto.subtle.importKey('raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: ua }, as.privateKey, 256));
  const salt = opts.salt || crypto.getRandomValues(new Uint8Array(16));
  const ikm = await hkdf(authSecret, ecdh, cat(enc.encode('WebPush: info\0'), uaPub, asPub), 32);
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, cat(payload, new Uint8Array([2]))));
  return cat(salt, new Uint8Array([0, 0, 0x10, 0]), new Uint8Array([asPub.length]), asPub, ct); // rs=4096, single record
}

const jwtCache = new Map(); // Apple: do not mint a new JWT more than about once per hour
async function vapid(env, endpoint) {
  const aud = new URL(endpoint).origin, t = Math.floor(Date.now() / 1000);
  let e = jwtCache.get(aud);
  if (!e || e.exp - t < 3600) {
    const exp = t + 12 * 3600; // must be <= 24h
    const head = b64u.enc(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
    const body = b64u.enc(enc.encode(JSON.stringify({ aud, exp, sub: env.VAPID_SUBJECT }))); // sub must be mailto: or https: (Apple)
    const key = await crypto.subtle.importKey('jwk', JSON.parse(env.VAPID_PRIVATE_JWK), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(`${head}.${body}`)); // r||s = JWS ES256
    e = { exp, jwt: `${head}.${body}.${b64u.enc(sig)}` };
    jwtCache.set(aud, e);
  }
  return `vapid t=${e.jwt}, k=${env.VAPID_PUBLIC}`;
}

export async function sendPush(env, sub, message, { ttl = 3600, urgency = 'normal', topic } = {}) {
  const body = await encrypt(sub, enc.encode(typeof message === 'string' ? message : JSON.stringify(message)));
  const res = await fetch(sub.endpoint, {
    method: 'POST', body,
    headers: { 'content-encoding': 'aes128gcm', 'content-type': 'application/octet-stream', ttl: String(ttl), urgency,
      authorization: await vapid(env, sub.endpoint), ...(topic && { topic }) },
  });
  return res.status; // 201 ok; 404/410 = subscription gone, delete it; 403 = bad JWT/key; 413 = > 4 KB
}
export { b64u };
