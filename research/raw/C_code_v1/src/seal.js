// Field-level encryption for especially sensitive columns (blood-test values, notes) before they go into D1.
// DATA_KEY = base64url of 32 random bytes (secret). AES-256-GCM, fresh 12-byte IV per value, AAD binds ciphertext to its row.
const enc = new TextEncoder(), dec = new TextDecoder();
const b64u = {
  enc: (b) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
};
const key = (env) => crypto.subtle.importKey('raw', b64u.dec(env.DATA_KEY), 'AES-GCM', false, ['encrypt', 'decrypt']);
export async function seal(env, text, aad = '') {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc.encode(aad) }, await key(env), enc.encode(text));
  return `v1.${b64u.enc(iv)}.${b64u.enc(ct)}`;
}
export async function open(env, sealed, aad = '') {
  const [v, iv, ct] = sealed.split('.');
  if (v !== 'v1') throw new Error('unknown format');
  return dec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64u.dec(iv), additionalData: enc.encode(aad) }, await key(env), b64u.dec(ct)));
}
