import { createECDH, createDecipheriv, hkdfSync } from 'node:crypto';
import { sendPush } from './src/push.js';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
const b64u = (b) => Buffer.from(b).toString('base64url');
// VAPID keys (what you would generate once, locally)
const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const jwk = await crypto.subtle.exportKey('jwk', kp.privateKey);
const pubRaw = new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey));
const env = { VAPID_PUBLIC: b64u(pubRaw), VAPID_PRIVATE_JWK: JSON.stringify(jwk), VAPID_SUBJECT: 'mailto:owner@example.com' };
// fake user agent (browser side)
const ua = createECDH('prime256v1'); ua.generateKeys(); const authSecret = crypto.getRandomValues(new Uint8Array(16));
const sub = { endpoint: 'https://web.push.apple.com/AbCd123', keys: { p256dh: b64u(ua.getPublicKey()), auth: b64u(authSecret) } };
let captured; globalThis.fetch = async (url, init) => { captured = { url, init }; return new Response(null, { status: 201 }); };
const msg = { web_push: 8030, notification: { title: 'שעת שינה', body: 'זמן להתכונן', navigate: 'https://example.com/' } };
const status = await sendPush(env, sub, msg, { ttl: 3600, urgency: 'high', topic: 'bedtime' });
const h = captured.init.headers;
ok(status === 201 && captured.url === sub.endpoint && captured.init.method === 'POST', 'POSTs to the subscription endpoint');
ok(h['content-encoding'] === 'aes128gcm' && h.ttl === '3600' && h.urgency === 'high' && h.topic === 'bedtime', 'TTL / Urgency / Topic / Content-Encoding headers set');
const m = /^vapid t=([\w-]+)\.([\w-]+)\.([\w-]+), k=([\w-]+)$/.exec(h.authorization);
ok(!!m && m[4] === env.VAPID_PUBLIC, 'Authorization: vapid t=<jwt>, k=<public key>');
const [, hd, cl, sg] = m;
const claims = JSON.parse(Buffer.from(cl, 'base64url').toString());
const now = Math.floor(Date.now() / 1000);
ok(JSON.parse(Buffer.from(hd, 'base64url').toString()).alg === 'ES256' && claims.aud === 'https://web.push.apple.com' && claims.exp > now && claims.exp - now <= 86400 && /^mailto:/.test(claims.sub), 'JWT header/claims: ES256, aud=origin, exp<=24h, sub=mailto');
const vkey = await crypto.subtle.importKey('raw', pubRaw, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
ok(await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, vkey, Buffer.from(sg, 'base64url'), new TextEncoder().encode(`${hd}.${cl}`)) && Buffer.from(sg, 'base64url').length === 64, 'JWT signature verifies with the advertised public key (raw r||s, 64 bytes)');
// independent decrypt with node:crypto (not Web Crypto)
const body = Buffer.from(captured.init.body);
const salt = body.subarray(0, 16), rs = body.readUInt32BE(16), idlen = body[20], asPub = body.subarray(21, 21 + idlen), ct = body.subarray(21 + idlen);
ok(rs === 4096 && idlen === 65 && asPub[0] === 4, 'header: rs=4096, keyid = 65-byte uncompressed P-256 point');
const secret = ua.computeSecret(asPub);
const ikm = Buffer.from(hkdfSync('sha256', secret, authSecret, Buffer.concat([Buffer.from('WebPush: info\0'), ua.getPublicKey(), asPub]), 32));
const cek = Buffer.from(hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
const nonce = Buffer.from(hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: nonce\0'), 12));
const d = createDecipheriv('aes-128-gcm', cek, nonce); d.setAuthTag(ct.subarray(ct.length - 16));
const plain = Buffer.concat([d.update(ct.subarray(0, ct.length - 16)), d.final()]);
ok(plain.at(-1) === 2 && JSON.parse(plain.subarray(0, -1).toString()).notification.title === 'שעת שינה', 'body decrypts with an independent node:crypto implementation, delimiter 0x02, Hebrew payload intact');
// JWT caching: second send within the hour reuses the same JWT
const first = h.authorization; await sendPush(env, sub, 'x'); ok(captured.init.headers.authorization === first, 'JWT reused for same audience (no re-sign per push)');
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
