// תובנות יומיות: שער עדכניות (סנכרון מהשעון), הרכבת היום עם המנוע, שמירה, ומשוב.
// הכרטיסים נשמרים פעם אחת ליום, ולכן רענון לא משנה אותם. יום שהורכב לפני שנתוני הלילה הגיעו מורכב מחדש כשהם מגיעים, אם עוד לא ניתן עליו משוב.
import { json } from './http.js';
import { V, BadInput } from './validate.js';
import { addDays, now } from './util.js';
import { nightsSummary, getProfile } from './data.js';
import { coachDate, freshnessGate } from './freshness.js';
import { composeDay } from './insights/compose.js';
import { CATALOG } from './evidence/catalog.js';
import { persona, topicAllowed } from './persona.js';

// הספרייה המאומתת כפי שהמנוע צריך אותה. הווים והכותרות מגיעים ממנה, ולעולם לא מהמודל
export const LIBRARY = CATALOG.map((t) => ({ id: t.id, title: t.title, strength: t.strength, tags: t.tags, hooks: t.hooks }));
export const CATALOG_IDS = new Set(CATALOG.map((t) => t.id));
// הספרייה שמותר לדחוף לפריסה הזו (בלי נושאים של טרום סוכרת למי שאין לו). בעיון חופשי ב"למה ככה?" הכול נשאר זמין
export const libraryFor = (env) => LIBRARY.filter(topicAllowed(persona(env)));

const safeJson = (s, d) => { try { return s ? JSON.parse(s) : d; } catch { return d; } };

async function loadLogs(env, from) {
  const [meals, works, checks] = await env.DB.batch([
    env.DB.prepare('SELECT local_date, local_time, kind, name, kcal, caffeine_mg, alcohol_g, glycemic_load FROM meal WHERE local_date >= ?1 ORDER BY ts').bind(from),
    env.DB.prepare('SELECT local_date, local_time, type, duration_min, rpe FROM workout WHERE local_date >= ?1 ORDER BY ts_start').bind(from),
    env.DB.prepare('SELECT local_date, rested, stress FROM checkin WHERE local_date >= ?1').bind(from),
  ]);
  const logs = {};
  const day = (d) => (logs[d] ||= { meals: [], workouts: [], checkin: null });
  for (const m of meals.results || []) day(m.local_date).meals.push(m);
  for (const w of works.results || []) day(w.local_date).workouts.push(w);
  for (const c of checks.results || []) day(c.local_date).checkin = c;
  return logs;
}

async function loadHistory(env, cdate) {
  const rows = ((await env.DB.prepare(
    `SELECT coach_date, lane, key, topics_json, variant, title, body, params_json, feedback FROM insight_card
     WHERE coach_date < ?1 AND coach_date >= ?2 ORDER BY coach_date DESC`).bind(cdate, addDays(cdate, -130)).all()).results) || [];
  return rows.map((r) => ({
    date: r.coach_date, lane: r.lane, key: r.key, topics: safeJson(r.topics_json, []), variant: r.variant, title: r.title, body: r.body,
    params: safeJson(r.params_json, {}), feedback: r.feedback || undefined,
  }));
}

const cardOut = (r) => ({
  id: r.id, lane: r.lane, key: r.key, label: r.label, emoji: r.emoji, title: r.title, body: r.body,
  topics: safeJson(r.topics_json, []), data: safeJson(r.data_json, null), feedback: r.feedback || null,
});

const ORDER = `CASE lane WHEN 'weekly' THEN 0 WHEN 'look' THEN 1 WHEN 'disc' THEN 2 WHEN 'quiet' THEN 2 WHEN 'research' THEN 3 ELSE 4 END`;

// מחזיר את כרטיסי היום, ומרכיב אותם אם צריך. gate אפשר להעביר מבחוץ (המאמן כבר סנכרן) כדי לא לסנכרן פעמיים
export async function getStack(env, cdate = coachDate(), gate = null) {
  const g = gate || (await freshnessGate(env, cdate));
  const hasSleep = !!g.sleepForToday;
  const day = await env.DB.prepare('SELECT has_sleep, notes_json FROM insight_day WHERE coach_date = ?1').bind(cdate).first();
  let compose = !day;
  // מרכיבים מחדש כשנתוני הלילה הגיעו אחרי ההרכבה, או שהלילה השתנה (קטע שינה נוסף), אבל רק אם לא ניתן משוב על הכרטיסים הקיימים
  if (day && hasSleep && (!day.has_sleep || (g.nightSig && safeJson(day.notes_json, {}).sig !== g.nightSig))) {
    const fb = await env.DB.prepare('SELECT COUNT(*) AS n FROM insight_card WHERE coach_date = ?1 AND feedback IS NOT NULL').bind(cdate).first();
    compose = !(fb && fb.n);
  }
  if (compose) {
    const [nights, profile, logs, history] = await Promise.all([nightsSummary(env, 28), getProfile(env), loadLogs(env, addDays(cdate, -31)), loadHistory(env, cdate)]);
    const r = composeDay({ date: cdate, nights, logs, profile, history, library: libraryFor(env), glucoseCtx: persona(env).glucoseCtx });
    const t = now();
    const ins = 'INSERT INTO insight_card (id, coach_date, lane, key, topics_json, variant, title, body, label, emoji, params_json, data_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)';
    await env.DB.batch([
      env.DB.prepare('DELETE FROM insight_card WHERE coach_date = ?1').bind(cdate),
      ...r.cards.map((c) => env.DB.prepare(ins).bind(c.id, cdate, c.lane, c.key, JSON.stringify(c.topics), c.variant, c.title, c.body, c.label, c.emoji, JSON.stringify(c.params || {}), c.data ? JSON.stringify(c.data) : null, t)),
      env.DB.prepare('INSERT OR REPLACE INTO insight_day (coach_date, has_sleep, generated_at, notes_json) VALUES (?1, ?2, ?3, ?4)').bind(cdate, r.hasSleep ? 1 : 0, t, JSON.stringify({ ...r.notes, sig: g.nightSig || null })),
    ]);
  }
  const rows = ((await env.DB.prepare(`SELECT * FROM insight_card WHERE coach_date = ?1 ORDER BY ${ORDER}, id`).bind(cdate).all()).results) || [];
  return { date: cdate, hasSleep, gate: g, cards: rows.map(cardOut) };
}

export async function insightsToday(env) {
  const s = await getStack(env);
  return json({ date: s.date, hasSleep: s.hasSleep, gate: { state: s.gate.state, lastDeviceSync: s.gate.lastDeviceSync }, cards: s.cards });
}

const LANES_WITH_FEEDBACK = ['look', 'disc', 'research', 'move', 'quiet'];
export async function insightsFeedback(request, env) {
  const b = await request.json().catch(() => null);
  if (!b || typeof b !== 'object' || Array.isArray(b)) throw new BadInput('body');
  const id = V.str(b.id, 40, 'id', { required: true });
  const m = id.match(/^(\d{4}-\d{2}-\d{2}):([a-z]+)$/);
  if (!m || !LANES_WITH_FEEDBACK.includes(m[2])) throw new BadInput('id');
  V.date(m[1], 'id');
  const action = b.action == null || b.action === 'clear' ? null : V.oneOf(b.action, ['known', 'irrelevant', 'more'], 'action');
  const r = await env.DB.prepare('UPDATE insight_card SET feedback = ?1, feedback_at = ?2 WHERE id = ?3').bind(action, action ? now() : null, id).run();
  return r.meta.changes ? json({ ok: true, feedback: action }) : json({ error: 'not_found' }, 404);
}
