// נתוני השינה והיומן שהמאמן והתובנות קוראים: לילות מסוכמים, סטטיסטיקה, יומן של יום, פרופיל.
import { addDays, localDate } from './util.js';
import { nightsByDate, SESSION_COLS } from './gh/nights.js';

const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
const sd = (a) => { if (a.length < 3) return null; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const r1 = (x) => (x == null || Number.isNaN(x) ? null : Math.round(x * 10) / 10);
const bedMin = (hm) => { const [h, m] = hm.split(':').map(Number); const x = h * 60 + m; return x < 12 * 60 ? x + 24 * 60 : x; };   // אחרי חצות נספר כהמשך הלילה
const wakeMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
const pick = (arr, f) => arr.map(f).filter((v) => v != null);

export async function nightsSummary(env, n = 14) {
  const rows = ((await env.DB.prepare(`SELECT ${SESSION_COLS} FROM sleep_session WHERE night_date >= ?1`).bind(addDays(localDate(), -(n + 4))).all()).results) || [];
  const nights = nightsByDate(rows).slice(0, n);   // קטעי שינה סמוכים מאוחדים ללילה אחד, כמו ב-Google Health
  const dates = nights.map((x) => x.date);
  const rec = dates.length ? ((await env.DB.prepare(`SELECT * FROM daily_recovery WHERE date IN (${dates.map((_, i) => '?' + (i + 1)).join(',')})`).bind(...dates).all()).results || []) : [];
  const by = Object.fromEntries(rec.map((r) => [r.date, r]));
  return nights.map((r) => {
    const c = by[r.date] || {};
    return {
      date: r.date, bed: r.bed, wake: r.wake,
      asleep_min: r.asleep_min, in_period_min: r.in_bed_min, awake_min: r.awake_min, efficiency_pct: r.efficiency_pct, awake_count: r.awake_count,
      ...(r.segments.length > 1 ? { segments: r.segments } : {}),
      hrv_ms: c.hrv_rmssd_ms ?? null, rhr_bpm: c.rhr_bpm ?? null, breathing_per_min: c.br_bpm ?? null,
      skin_temp_dev_c: c.skin_nightly_c != null && c.skin_baseline_c != null ? r1(c.skin_nightly_c - c.skin_baseline_c) : null,
    };
  });
}

export function sleepStats(nights) {
  const n7 = nights.slice(0, 7);
  const asleep = mean(pick(n7, (n) => n.asleep_min));
  return {
    nights_available: nights.length,
    avg_asleep_h_7d: asleep == null ? null : r1(asleep / 60),
    bed_sd_min_7d: r1(sd(pick(n7, (n) => (n.bed ? bedMin(n.bed) : null)))),
    wake_sd_min_7d: r1(sd(pick(n7, (n) => (n.wake ? wakeMin(n.wake) : null)))),
    hrv_mean_7d: r1(mean(pick(n7, (n) => n.hrv_ms))), hrv_mean_14d: r1(mean(pick(nights, (n) => n.hrv_ms))),
    rhr_mean_7d: r1(mean(pick(n7, (n) => n.rhr_bpm))), rhr_mean_14d: r1(mean(pick(nights, (n) => n.rhr_bpm))),
  };
}

export async function dayLog(env, date) {
  const [meals, workouts, checkin] = await env.DB.batch([
    env.DB.prepare('SELECT local_time, kind, name, kcal, protein_g, carbs_g, fat_g, sat_fat_g, sugar_g, fiber_g, caffeine_mg, alcohol_g, glycemic_load FROM meal WHERE local_date = ?1 ORDER BY ts').bind(date),
    env.DB.prepare('SELECT local_time, type, duration_min, rpe FROM workout WHERE local_date = ?1 ORDER BY ts_start').bind(date),
    env.DB.prepare('SELECT rested, stress FROM checkin WHERE local_date = ?1').bind(date),
  ]);
  return { date, meals: meals.results || [], workouts: workouts.results || [], checkin: (checkin.results || [])[0] || null };
}

export const getProfile = async (env) => JSON.parse(((await env.DB.prepare('SELECT json FROM profile WHERE id = 1').first()) || {}).json || '{}');
