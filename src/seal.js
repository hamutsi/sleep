// הצפנה ברמת השדה לערכים רגישים (טוקנים, בדיקות דם) לפני שהם נכנסים ל-D1.
// DATA_KEY = base64url של 32 בתים אקראיים (סוד). AES-256-GCM, IV חדש לכל ערך, AAD קושר את הצפנה לשורה.
// חשוב: לעולם לא להחליף את DATA_KEY אחרי שנשמרו נתונים, אחרת אי אפשר לפענח אותם.
import { b64u, enc, dec } from './util.js';

const key = (env) => crypto.subtle.importKey('raw', b64u.dec(env.DATA_KEY), 'AES-GCM', false, ['encrypt', 'decrypt']);

export async function seal(env, text, aad = '') {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc.encode(aad) }, await key(env), enc.encode(text));
  return `v1.${b64u.enc(iv)}.${b64u.enc(ct)}`;
}

export async function open(env, sealed, aad = '') {
  const [v, iv, ct] = String(sealed).split('.');
  if (v !== 'v1') throw new Error('unknown format');
  return dec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64u.dec(iv), additionalData: enc.encode(aad) }, await key(env), b64u.dec(ct)));
}
