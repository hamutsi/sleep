// מאמן שינה: נקודת כניסה. wrangler.toml: [assets] run_worker_first = ["/api/*"], כלומר רק נתיבי API מגיעים לכאן.
import { json, redirect, csrfOk, secure } from './http.js';
import { login, logout, logoutAll, session } from './auth.js';
import { connectStart, connectCallback } from './gh/oauth.js';
import { ghStatus, ghSync, ghLastNight, ghShape, ghSelftest, ghDisconnect } from './gh/routes.js';
import { BadInput } from './validate.js';
import {
  profileGet, profilePut, mealAnalyze, mealCreate, mealList, mealDelete, mealThumb, quickCreate,
  workoutCreate, workoutList, workoutDelete, checkinPut, dayGet, ID_RE,
} from './logs.js';
import { coachStatus, coachStart, coachMessage, coachThreads, coachThread, coachSelftest } from './coach.js';
import { insightsToday, insightsFeedback } from './insights_api.js';

async function route(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;
  const m = request.method;

  if (pathname === '/api/login' && m === 'POST') return login(request, env);
  if (pathname === '/api/logout' && m === 'POST') return csrfOk(request) ? logout() : json({ error: 'forbidden' }, 403);
  // החזרה מגוגל: נקשרת לבקשה דרך state חד-פעמי במסד, לא דרך העוגייה
  if (pathname === '/api/gh/callback' && m === 'GET') return connectCallback(request, env);

  if (!env.DB) return json({ error: 'not_configured' }, 503);
  const s = await session(request, env);
  if (!s) {
    if (pathname === '/api/gh/connect') return redirect(`${env.APP_URL || ''}/`);
    return json({ error: 'unauthenticated' }, 401);
  }
  if (!csrfOk(request)) return json({ error: 'forbidden' }, 403);

  let res;
  let mm;
  if (pathname === '/api/me' && m === 'GET') res = json({ ok: true });
  else if (pathname === '/api/logout-all' && m === 'POST') res = await logoutAll(env);

  else if (pathname === '/api/gh/status' && m === 'GET') res = await ghStatus(env);
  else if (pathname === '/api/gh/connect' && m === 'GET') res = await connectStart(env);
  else if (pathname === '/api/gh/sync' && m === 'POST') res = await ghSync(env, request);
  else if (pathname === '/api/gh/last-night' && m === 'GET') res = await ghLastNight(env);
  else if (pathname === '/api/gh/shape' && m === 'GET') res = await ghShape(env);
  else if (pathname === '/api/gh/selftest' && m === 'GET') res = await ghSelftest(env);
  else if (pathname === '/api/gh/disconnect' && m === 'POST') res = await ghDisconnect(env);

  else if (pathname === '/api/profile' && m === 'GET') res = await profileGet(env);
  else if (pathname === '/api/profile' && m === 'PUT') res = await profilePut(request, env);
  else if (pathname === '/api/day' && m === 'GET') res = await dayGet(url, env);
  else if (pathname === '/api/checkin' && m === 'PUT') res = await checkinPut(request, env);

  else if (pathname === '/api/meals/analyze' && m === 'POST') res = await mealAnalyze(request, env);
  else if (pathname === '/api/meals' && m === 'POST') res = await mealCreate(request, env);
  else if (pathname === '/api/meals' && m === 'GET') res = await mealList(url, env);
  else if (pathname === '/api/quick' && m === 'POST') res = await quickCreate(request, env);
  else if ((mm = pathname.match(/^\/api\/meals\/([^/]+)(\/thumb)?$/)) && ID_RE.test(mm[1])) {
    if (mm[2] && m === 'GET') res = await mealThumb(mm[1], env);
    else if (!mm[2] && m === 'DELETE') res = await mealDelete(mm[1], env);
    else res = json({ error: 'not_found' }, 404);
  }

  else if (pathname === '/api/coach/status' && m === 'GET') res = await coachStatus(env);
  else if (pathname === '/api/coach/selftest' && m === 'GET') res = await coachSelftest(env);
  else if (pathname === '/api/coach/start' && m === 'POST') res = await coachStart(request, env);
  else if (pathname === '/api/coach/message' && m === 'POST') res = await coachMessage(request, env);
  else if (pathname === '/api/coach/threads' && m === 'GET') res = await coachThreads(env);
  else if (pathname === '/api/coach/thread' && m === 'GET') res = await coachThread(url, env);

  else if (pathname === '/api/insights/today' && m === 'GET') res = await insightsToday(env);
  else if (pathname === '/api/insights/feedback' && m === 'POST') res = await insightsFeedback(request, env);

  else if (pathname === '/api/workouts' && m === 'POST') res = await workoutCreate(request, env);
  else if (pathname === '/api/workouts' && m === 'GET') res = await workoutList(url, env);
  else if ((mm = pathname.match(/^\/api\/workouts\/([^/]+)$/)) && ID_RE.test(mm[1]) && m === 'DELETE') res = await workoutDelete(mm[1], env);

  else res = json({ error: 'not_found' }, 404);

  if (s.refresh) res.headers.append('set-cookie', s.refresh);   // תוקף מתחדש
  return res;
}

export default {
  async fetch(request, env) {
    try {
      const res = await route(request, env);
      return secure(res, res.headers.has('cache-control') ? {} : { 'cache-control': 'no-store' });
    } catch (e) {
      if (e instanceof BadInput) return secure(json({ error: 'bad_input', field: e.field }, 400));
      console.error(e);
      return secure(json({ error: 'server' }, 500));
    }
  },
};
