// פרופיל, אוכל ושתייה, אימונים, בדיקת בוקר וסיכום יום.
// כל תאריך ושעה מגיעים כפי שהמשתמש רואה אותם בשעון ישראל.
import { json } from './http.js';
import { V, BadInput } from './validate.js';
import { localDate, addDays, localToEpoch, now, TZ } from './util.js';
import { analyzeMeal, GeminiError } from './gemini.js';
import { nutritionTargets } from './nutrition.js';
import { persona } from './persona.js';

const uuid = () => crypto.randomUUID();
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// כמויות מוכנות לרישום מהיר. ערכי קפאין ואלכוהול הם הערכות ממוצעות, וניתן להכפיל בכמות.
export const QUICK = {
  coffee:     { name: 'קפה', kind: 'drink', caffeine_mg: 80 },
  tea:        { name: 'תה', kind: 'drink', caffeine_mg: 40 },
  preworkout: { name: 'פרה-וורקאוט', kind: 'drink', caffeine_mg: 200 },
  wine:       { name: 'כוס יין', kind: 'drink', alcohol_g: 14 },
  beer:       { name: 'בירה', kind: 'drink', alcohol_g: 13 },
  spirits:    { name: 'משקה חריף', kind: 'drink', alcohol_g: 13 },
  snack:      { name: 'נשנוש', kind: 'snack' },
};

export const nowLocal = () => ({
  date: localDate(),
  time: new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date()),
});

// תאריך סביר לרישום: עד 30 יום אחורה ויום אחד קדימה
function reasonableDate(date, field) {
  const today = localDate();
  if (date > addDays(today, 1) || date < addDays(today, -30)) throw new BadInput(field);
  return date;
}

const jsonBody = async (request) => {
  const b = await request.json().catch(() => null);
  if (!b || typeof b !== 'object' || Array.isArray(b)) throw new BadInput('body');
  return b;
};

/* ---------- פרופיל ---------- */
export async function profileGet(env) {
  const r = await env.DB.prepare('SELECT json, updated_at FROM profile WHERE id = 1').first();
  return json({ profile: JSON.parse((r && r.json) || '{}'), updated_at: r && r.updated_at });
}

export async function profilePut(request, env) {
  const b = await jsonBody(request);
  const p = {
    first_name: V.str(b.first_name, 40, 'first_name'),
    height_cm: V.num(b.height_cm, 120, 230, 'height_cm', { int: true }),
    usual_bed: V.time(b.usual_bed, 'usual_bed', { required: false }),
    usual_wake: V.time(b.usual_wake, 'usual_wake', { required: false }),
    statin_name: V.str(b.statin_name, 60, 'statin_name'),
    statin_dose: V.str(b.statin_dose, 30, 'statin_dose'),
    statin_time: V.oneOf(b.statin_time, ['morning', 'noon', 'evening', 'bedtime', 'unknown'], 'statin_time', { required: false }),
    complaint: V.str(b.complaint, 300, 'complaint'),
    goal: V.oneOf(b.goal, ['muscle_gain', 'maintain'], 'goal', { required: false }),
    weight_kg: V.num(b.weight_kg, 35, 200, 'weight_kg'),
    kcal_target: V.num(b.kcal_target, 1200, 5000, 'kcal_target', { int: true }),
  };
  await env.DB.prepare('UPDATE profile SET json = ?1, updated_at = ?2 WHERE id = 1').bind(JSON.stringify(p), now()).run();
  return json({ ok: true, profile: p });
}

/* ---------- אוכל ושתייה ---------- */
function geminiFail(e) {
  if (!(e instanceof GeminiError)) throw e;
  return json({ error: e.code }, e.status);
}

export async function mealAnalyze(request, env) {
  const b = await jsonBody(request);
  const image = typeof b.image === 'string' && b.image ? b.image : null;
  const text = V.str(b.text, 500, 'text');
  if (!image && !text) throw new BadInput('image');
  if (image && (image.length > 3_000_000 || !/^[A-Za-z0-9+/=]+$/.test(image.slice(0, 400)))) throw new BadInput('image');
  const mime = V.oneOf(b.mime || 'image/jpeg', ['image/jpeg', 'image/png', 'image/webp'], 'mime');
  try { return json({ analysis: await analyzeMeal(env, { image, mime, text }) }); } catch (e) { return geminiFail(e); }
}

const MEAL_COLS = 'id, ts, local_date, local_time, kind, name, note, kcal, protein_g, carbs_g, sugar_g, fiber_g, fat_g, sat_fat_g, caffeine_mg, alcohol_g, glycemic_load, confidence, source, (thumb_b64 IS NOT NULL) AS has_thumb';

export async function mealCreate(request, env) {
  const b = await jsonBody(request);
  const date = reasonableDate(V.date(b.date, 'date'), 'date');
  const time = V.time(b.time, 'time');
  let thumb = null;
  if (b.thumb != null) {
    if (typeof b.thumb !== 'string' || b.thumb.length > 120_000 || !/^[A-Za-z0-9+/=]+$/.test(b.thumb)) throw new BadInput('thumb');
    thumb = b.thumb;
  }
  const items = Array.isArray(b.items) ? JSON.stringify(b.items.slice(0, 30).map((it) => ({
    name: String((it && it.name) || '').slice(0, 80), grams: V.num(it && it.grams, 0, 3000, 'items') ?? 0, kcal: V.num(it && it.kcal, 0, 4000, 'items') ?? 0,
  }))) : null;
  const row = {
    id: uuid(), ts: localToEpoch(date, time), local_date: date, local_time: time,
    kind: V.oneOf(b.kind || 'meal', ['meal', 'snack', 'drink'], 'kind'),
    name: V.str(b.name, 80, 'name', { required: true }), note: V.str(b.note, 300, 'note'),
    kcal: V.num(b.kcal, 0, 6000, 'kcal', { int: true }), protein_g: V.num(b.protein_g, 0, 400, 'protein_g'), carbs_g: V.num(b.carbs_g, 0, 800, 'carbs_g'),
    sugar_g: V.num(b.sugar_g, 0, 500, 'sugar_g'), fiber_g: V.num(b.fiber_g, 0, 150, 'fiber_g'), fat_g: V.num(b.fat_g, 0, 400, 'fat_g'), sat_fat_g: V.num(b.sat_fat_g, 0, 200, 'sat_fat_g'),
    caffeine_mg: V.num(b.caffeine_mg, 0, 1500, 'caffeine_mg', { int: true }), alcohol_g: V.num(b.alcohol_g, 0, 400, 'alcohol_g'),
    glycemic_load: V.oneOf(b.glycemic_load, ['low', 'medium', 'high'], 'glycemic_load', { required: false }),
    items_json: items, confidence: V.oneOf(b.confidence, ['low', 'medium', 'high'], 'confidence', { required: false }),
    source: V.oneOf(b.source || 'text', ['photo', 'text', 'quick'], 'source'), thumb_b64: thumb, created_at: now(),
  };
  const cols = Object.keys(row);
  await env.DB.prepare(`INSERT INTO meal (${cols.join(', ')}) VALUES (${cols.map((_, i) => '?' + (i + 1)).join(', ')})`).bind(...cols.map((c) => row[c])).run();
  return json({ ok: true, id: row.id }, 201);
}

export async function mealList(url, env) {
  const date = V.date(url.searchParams.get('date') || localDate(), 'date');
  const r = await env.DB.prepare(`SELECT ${MEAL_COLS} FROM meal WHERE local_date = ?1 ORDER BY ts`).bind(date).all();
  return json({ date, meals: r.results || [] });
}

export async function mealDelete(id, env) {
  const r = await env.DB.prepare('DELETE FROM meal WHERE id = ?1').bind(id).run();
  return r.meta.changes ? json({ ok: true }) : json({ error: 'not_found' }, 404);
}

export async function mealThumb(id, env) {
  const r = await env.DB.prepare('SELECT thumb_b64 FROM meal WHERE id = ?1').bind(id).first();
  if (!r || !r.thumb_b64) return json({ error: 'not_found' }, 404);
  const bin = Uint8Array.from(atob(r.thumb_b64), (c) => c.charCodeAt(0));
  return new Response(bin, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'private, max-age=86400' } });
}

export async function quickCreate(request, env) {
  const b = await jsonBody(request);
  const preset = QUICK[b.kind];
  if (!Object.prototype.hasOwnProperty.call(QUICK, String(b.kind)) || !preset) throw new BadInput('kind');
  const count = V.num(b.count ?? 1, 1, 6, 'count', { int: true });
  const cur = nowLocal();
  const date = reasonableDate(V.date(b.date || cur.date, 'date'), 'date');
  const time = V.time(b.time || cur.time, 'time');
  const row = {
    id: uuid(), ts: localToEpoch(date, time), local_date: date, local_time: time, kind: preset.kind,
    name: count > 1 ? `${preset.name} x${count}` : preset.name, caffeine_mg: preset.caffeine_mg ? preset.caffeine_mg * count : null,
    alcohol_g: preset.alcohol_g ? preset.alcohol_g * count : null, source: 'quick', created_at: now(),
  };
  const cols = Object.keys(row);
  await env.DB.prepare(`INSERT INTO meal (${cols.join(', ')}) VALUES (${cols.map((_, i) => '?' + (i + 1)).join(', ')})`).bind(...cols.map((c) => row[c])).run();
  return json({ ok: true, id: row.id, date, time }, 201);
}

/* ---------- אימונים ---------- */
export async function workoutCreate(request, env) {
  const b = await jsonBody(request);
  const date = reasonableDate(V.date(b.date, 'date'), 'date');
  const time = V.time(b.time, 'time');
  const row = {
    id: uuid(), ts_start: localToEpoch(date, time), local_date: date, local_time: time,
    duration_min: V.num(b.duration_min, 5, 600, 'duration_min', { int: true, required: true }),
    type: V.oneOf(b.type, ['weights', 'cardio', 'walk', 'other'], 'type'),
    rpe: V.num(b.rpe, 1, 10, 'rpe', { int: true }), note: V.str(b.note, 300, 'note'), source: 'manual', created_at: now(),
  };
  const cols = Object.keys(row);
  await env.DB.prepare(`INSERT INTO workout (${cols.join(', ')}) VALUES (${cols.map((_, i) => '?' + (i + 1)).join(', ')})`).bind(...cols.map((c) => row[c])).run();
  return json({ ok: true, id: row.id }, 201);
}

export async function workoutList(url, env) {
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get('days')) || 14));
  const r = await env.DB.prepare('SELECT * FROM workout WHERE local_date >= ?1 ORDER BY ts_start DESC').bind(addDays(localDate(), -days)).all();
  return json({ workouts: r.results || [] });
}

export async function workoutDelete(id, env) {
  const r = await env.DB.prepare('DELETE FROM workout WHERE id = ?1').bind(id).run();
  return r.meta.changes ? json({ ok: true }) : json({ error: 'not_found' }, 404);
}

/* ---------- בדיקת בוקר ---------- */
export async function checkinPut(request, env) {
  const b = await jsonBody(request);
  const date = reasonableDate(V.date(b.date || localDate(), 'date'), 'date');
  const rested = V.num(b.rested, 1, 5, 'rested', { int: true });
  const stress = V.num(b.stress, 1, 5, 'stress', { int: true });
  const note = V.str(b.note, 300, 'note');
  if (rested == null && stress == null && !note) throw new BadInput('rested');
  await env.DB.prepare(
    `INSERT INTO checkin (local_date, rested, stress, note, created_at) VALUES (?1, ?2, ?3, ?4, ?5)
     ON CONFLICT(local_date) DO UPDATE SET rested = COALESCE(excluded.rested, rested), stress = COALESCE(excluded.stress, stress), note = COALESCE(excluded.note, note)`
  ).bind(date, rested, stress, note, now()).run();
  return json({ ok: true, date });
}

/* ---------- סיכום יום ---------- */
export async function dayGet(url, env) {
  const date = V.date(url.searchParams.get('date') || localDate(), 'date');
  const [meals, workouts, checkin, prof] = await env.DB.batch([
    env.DB.prepare(`SELECT ${MEAL_COLS} FROM meal WHERE local_date = ?1 ORDER BY ts`).bind(date),
    env.DB.prepare('SELECT * FROM workout WHERE local_date = ?1 ORDER BY ts_start').bind(date),
    env.DB.prepare('SELECT * FROM checkin WHERE local_date = ?1').bind(date),
    env.DB.prepare('SELECT json FROM profile WHERE id = 1'),
  ]);
  let profile = {};
  try { profile = JSON.parse(((prof.results || [])[0] || {}).json || '{}'); } catch { /* ריק */ }
  const m = meals.results || [];
  const sum = (k) => m.reduce((a, r) => a + (r[k] || 0), 0);
  const withCaf = m.filter((r) => r.caffeine_mg > 0);
  const eaten = m.filter((r) => r.kind !== 'drink');
  return json({
    date, meals: m, workouts: workouts.results || [], checkin: (checkin.results || [])[0] || null,
    totals: {
      kcal: Math.round(sum('kcal')), protein_g: Math.round(sum('protein_g')), carbs_g: Math.round(sum('carbs_g')), fat_g: Math.round(sum('fat_g')),
      sat_fat_g: Math.round(sum('sat_fat_g') * 10) / 10, sugar_g: Math.round(sum('sugar_g')), fiber_g: Math.round(sum('fiber_g')), caffeine_mg: Math.round(sum('caffeine_mg')),
      alcohol_g: Math.round(sum('alcohol_g') * 10) / 10,
      last_caffeine_time: withCaf.length ? withCaf[withCaf.length - 1].local_time : null,
      last_meal_time: eaten.length ? eaten[eaten.length - 1].local_time : null,
    },
    targets: nutritionTargets(profile, persona(env)),
  });
}

export { ID_RE };
