// usage: LOGIN_PEPPER=... node make-verifier.mjs "my long passphrase"
const enc = new TextEncoder();
const pass = (process.argv[2] ?? '');
const k = await crypto.subtle.importKey('raw', enc.encode(process.env.LOGIN_PEPPER), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
const sig = new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode('login:' + pass)));
console.log(Buffer.from(sig).toString('base64url'));
