import { login, logout, logoutAll, session, csrfOk, secure, json } from './auth.js';
import { chatStream, analyzeMeal, coachWithTools } from './gemini.js';

const SYSTEM = 'You are a concise sleep coach. Reply in Hebrew.';

async function route(request, env) {
  const { pathname } = new URL(request.url);
  if (pathname === '/api/login' && request.method === 'POST') return login(request, env);
  if (pathname === '/api/logout' && request.method === 'POST') return csrfOk(request) ? logout() : json({ error: 'forbidden' }, 403);

  const s = await session(request, env); // everything below needs a valid session
  if (!s) return json({ error: 'unauthenticated' }, 401);
  if (!csrfOk(request)) return json({ error: 'forbidden' }, 403);

  let res;
  if (pathname === '/api/me') res = json({ ok: true });
  else if (pathname === '/api/logout-all' && request.method === 'POST') res = await logoutAll(env);
  else if (pathname === '/api/chat' && request.method === 'POST') {
    const { messages } = await request.json();
    res = await chatStream(env, messages, SYSTEM, request.signal);
  } else if (pathname === '/api/meal' && request.method === 'POST') {
    const { image, mime } = await request.json();
    res = json(await analyzeMeal(env, image, mime));
  } else if (pathname === '/api/coach' && request.method === 'POST') {
    const { text } = await request.json();
    const exec = { get_recent_sleep: async ({ nights }) => ({ nights, avg_hours: 6.9, note: 'stub' }) };
    res = json(await coachWithTools(env, [{ role: 'user', parts: [{ text }] }], SYSTEM, exec));
  } else res = json({ error: 'not_found' }, 404);
  if (s.refresh) res.headers.append('set-cookie', s.refresh); // sliding expiry
  return res;
}

// One handler for both platforms: Workers `fetch` and Pages Functions `onRequest`.
export async function handle(request, env) {
  try { return secure(await route(request, env), { 'cache-control': 'no-store' }); }
  catch (e) { console.error(e); return secure(json({ error: 'server' }, 500)); }
}
