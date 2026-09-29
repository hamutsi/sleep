// node make-test-vars.mjs -> writes .dev.vars with FAKE test secrets for the local test scripts. Never use these values in production.
import { writeFileSync } from 'node:fs';
const enc = new TextEncoder();
const rnd = () => Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url');
const pepper = rnd();
const k = await crypto.subtle.importKey('raw', enc.encode(pepper), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
const verifier = Buffer.from(await crypto.subtle.sign('HMAC', k, enc.encode('login:correct horse battery staple'))).toString('base64url');
const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const vars = {
  GEMINI_API_KEY: 'test-key-not-real', SESSION_SECRET: 'test-session-secret-0123456789abcdef0123456789abcdef', LOGIN_PEPPER: pepper, PASS_VERIFIER: verifier,
  VAPID_PUBLIC: Buffer.from(await crypto.subtle.exportKey('raw', kp.publicKey)).toString('base64url'),
  VAPID_PRIVATE_JWK: JSON.stringify(await crypto.subtle.exportKey('jwk', kp.privateKey)), VAPID_SUBJECT: 'mailto:owner@example.com',
  PUSH_SLOTS: '*', APP_URL: 'https://sleep.example.com', DATA_KEY: rnd(),
};
writeFileSync('.dev.vars', Object.entries(vars).map(([a, b]) => `${a}='${b}'`).join('\n') + '\n');
console.log('wrote .dev.vars (test passphrase: "correct horse battery staple")');
