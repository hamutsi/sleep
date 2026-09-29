// TEST ONLY (not part of the deliverable): probes for workerd behaviour.
import { encrypt, b64u } from './push.js';
import { seal, open } from './seal.js';
export async function rfc8291() {
  const d = 'yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw';
  const pub = 'BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8';
  const jwk = (x, y, dd) => ({ kty: 'EC', crv: 'P-256', x, y, ...(dd && { d: dd, key_ops: ['deriveBits'] }) });
  const raw = b64u.dec(pub); const x = b64u.enc(raw.slice(1, 33)), y = b64u.enc(raw.slice(33, 65));
  const priv = await crypto.subtle.importKey('jwk', jwk(x, y, d), { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const pubk = await crypto.subtle.importKey('jwk', jwk(x, y), { name: 'ECDH', namedCurve: 'P-256' }, true, []);
  const body = await encrypt(
    { keys: { p256dh: 'BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4', auth: 'BTBZMqHH6r4Tts7J_aSIgg' } },
    new TextEncoder().encode('When I grow up, I want to be a watermelon'),
    { asKeys: { privateKey: priv, publicKey: pubk }, salt: b64u.dec('DGv6ra1nlYgDCS1FRnbzlw') });
  return new Response(b64u.enc(body));
}
export async function sealProbe() {
  const env2 = { DATA_KEY: b64u.enc(crypto.getRandomValues(new Uint8Array(32))) };
  const out = {};
  const s1 = await seal(env2, 'LDL 131 mg/dL, ferritin 48', 'labs:42');
  out.roundtrip = (await open(env2, s1, 'labs:42')) === 'LDL 131 mg/dL, ferritin 48';
  out.unique_iv = (await seal(env2, 'x')) !== (await seal(env2, 'x'));
  try { await open(env2, s1, 'labs:43'); out.wrongAad = 'ACCEPTED'; } catch { out.wrongAad = 'rejected'; }
  const parts = s1.split('.'); parts[2] = parts[2].slice(0, -3) + 'AAA';
  try { await open(env2, parts.join('.'), 'labs:42'); out.tamper = 'ACCEPTED'; } catch { out.tamper = 'rejected'; }
  return new Response(JSON.stringify(out));
}
export async function tseProbe() {
  const out = {};
  const t = (a, b) => crypto.subtle.timingSafeEqual(new Uint8Array(a), new Uint8Array(b));
  try { out.equal = t([1, 2, 3], [1, 2, 3]); out.diff = t([1, 2, 3], [1, 2, 4]); } catch (e) { out.err = String(e); }
  try { t([1, 2, 3], [1, 2]); } catch (e) { out.mismatch = String(e); }
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode('p'), 'PBKDF2', false, ['deriveBits']);
  for (const it of [100000, 600000]) {
    try { await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new Uint8Array(16), iterations: it }, k, 256); out['pbkdf2_' + it] = 'ok'; } catch (e) { out['pbkdf2_' + it] = String(e); }
  }
  out.streams = typeof TextDecoderStream + '/' + typeof TextEncoderStream;
  return new Response(JSON.stringify(out));
}
