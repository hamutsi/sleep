// node gen-vapid.mjs -> prints the VAPID keypair. Public key goes to [vars] VAPID_PUBLIC, private JWK to a secret.
const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
console.log('VAPID_PUBLIC=' + Buffer.from(await crypto.subtle.exportKey('raw', kp.publicKey)).toString('base64url'));
console.log("VAPID_PRIVATE_JWK='" + JSON.stringify(await crypto.subtle.exportKey('jwk', kp.privateKey)) + "'");
