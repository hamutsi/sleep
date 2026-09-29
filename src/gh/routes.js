import { json } from '../http.js';
import { getConn, ghConfigured, disconnect, selftest, SCOPES } from './oauth.js';
import { syncRecent, lastNight, shapeOf } from './sync.js';
import { GhError } from './errors.js';

// שגיאת הרשאה של גוגל חוזרת כ-409 ולא כ-401, כדי שהאפליקציה לא תחשוב שהמשתמש התנתק
const fail = (e) => {
  if (e instanceof GhError) return json({ error: e.code, detail: e.detail }, e.status === 401 ? 409 : e.status);
  console.error(e);
  return json({ error: 'server' }, 500);
};

export async function ghStatus(env) {
  const c = await getConn(env);
  const short = (s) => s.replace(/^.*googlehealth\./, '').replace(/\.readonly$/, '');
  const granted = (c.granted_scopes || '').split(' ').filter(Boolean);
  return json({
    configured: ghConfigured(env),
    status: c.status,
    // קיים תוקף של 7 ימים רק במצב Testing. אחרי פרסום ל-production הוא נעלם
    tokenMode: c.status === 'connected' ? (c.refresh_expires_at ? 'testing' : 'production') : null,
    refreshExpiresAt: c.refresh_expires_at,
    connectedAt: c.connected_at,
    lastSyncAt: c.last_sync_at,
    lastDeviceSync: c.last_device_sync,
    deviceVersion: c.device_version,
    grantedScopes: granted.map(short),
    scopesComplete: SCOPES.every((s) => granted.includes(s)),
    lastError: c.last_error,
  });
}

export async function ghSync(env, request) {
  try {
    const body = await request.json().catch(() => ({}));
    const days = Math.min(14, Math.max(1, Number(body && body.days) || 3));
    return json(await syncRecent(env, days));
  } catch (e) { return fail(e); }
}

export async function ghLastNight(env) {
  return json({ night: await lastNight(env) });
}

export async function ghShape(env) {
  return json(await shapeOf(env));
}

export async function ghSelftest(env) {
  return json(await selftest(env));
}

export async function ghDisconnect(env) {
  await disconnect(env);
  return json({ ok: true });
}
