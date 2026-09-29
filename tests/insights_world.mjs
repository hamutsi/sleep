// עולם סינתטי לבדיקות מנוע התובנות: ספרייה עם 40 המזהים המתוכננים, לילות ויומנים של אדם דמיוני. אין כאן נתונים אמיתיים.
import { addDays, weekday, fmtHM } from '../src/insights/stats.js';

/* ---------- ספרייה סינתטית: אותם 40 מזהים שהספרייה האמיתית מתוכננת להכיל ---------- */
export const IDS = ['sleep_regularity', 'sleep_duration_need', 'sleep_stages_aging', 'wearable_accuracy', 'hrv_rhr_recovery', 'caffeine_timing', 'alcohol_sleep_hrv', 'dinner_timing_late_eating', 'evening_carbs_protein',
  'exercise_timing_evening', 'overtraining_recovery_signals', 'morning_light_circadian', 'evening_light_screens', 'bedroom_temperature_warm_bath', 'orthosomnia_tracker_anxiety', 'social_jetlag', 'alcohol_and_sleep_apnea',
  'preworkout_caffeine', 'cbt_i_basics', 'sleep_apnea_signs_men', 'statin_and_sleep', 'prediabetes_sleep_glucose', 'post_meal_walk', 'melatonin_facts', 'magnesium_supplements_sleep', 'nocturia_prostate_sleep',
  'stress_breathing_wind_down', 'naps_rules', 'tiny_changes_experiments', 'sleep_heart_health', 'time_restricted_eating_sleep', 'sleep_muscle_recovery', 'chronotype_and_midlife', 'lifting_and_sleep_quality',
  'statin_muscle_symptoms', 'statin_and_blood_sugar', 'labs_annual_recheck_prediabetes', 'ferritin_and_restless_legs', 'statin_food_interactions', 'n_of_1_experiments'];

export function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
export const gauss = (r) => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const STR = ['strong', 'moderate', 'moderate', 'limited', 'method'];
export function makeLibrary(seed = 7) {
  const r = rng(seed);
  const pool = Array.from({ length: 400 }, (_, i) => 'מילה' + String.fromCharCode(0x05d0 + (i % 27)) + String.fromCharCode(0x05d0 + ((i * 7) % 27)) + String.fromCharCode(0x05d0 + ((i * 13) % 27)) + (i % 5 ? '' : 'ים'));
  return IDS.map((id, i) => ({
    id, title: `למה ${id.replace(/_/g, ' ')} חשוב?`, strength: STR[i % STR.length], tags: [], rules: [],
    hooks: [0, 1, 2].map(() => Array.from({ length: 12 }, () => pool[Math.floor(r() * pool.length)]).join(' ')),
  }));
}
export const LIB = makeLibrary();

/* ---------- עולם סינתטי: לילות ויומנים ---------- */
export function world({ seed, days, start, events = true, logRate = 0.85, missingNight = 0.03, clean = false, alcoholP = [0.1, 0.38] }) {
  const r = rng(seed);
  const nightsBy = {}, logs = {};
  const chance = (p) => events && r() < p;
  for (let k = -1; k < days; k++) {
    const D = addDays(start, k);
    const wd = weekday(D), free = wd === 5 || wd === 6;
    const prevWd = weekday(addDays(D, -1));
    const alcohol = chance(prevWd === 4 || prevWd === 5 ? alcoholP[1] : alcoholP[0]);
    const lateCaf = chance(0.25), preworkout = chance(0.05);
    const lateWo = chance(0.15), normalWo = !lateWo && chance(0.4);
    const lateMeal = chance(0.2);
    // clean: אדם עם הרגלים מצוינים (הירדמות 22:45, השכמה 06:30 גם בסוף שבוע, ארוחת ערב מוקדמת, רעש נמוך)
    const wakeMin = 6 * 60 + 30 + (!clean && free ? 60 + Math.floor(r() * 40) : 0) + Math.round(gauss(r) * (clean ? 7 : 12));
    const bedMin = (clean ? 22 * 60 + 45 : 23 * 60 + 15) + (alcohol ? 30 : 0) + (!clean && free ? 45 : 0) + Math.round(gauss(r) * (clean ? 7 : 15));
    const bedClock = fmtHM(bedMin), wakeClock = fmtHM(wakeMin);
    const inPeriod = 24 * 60 + wakeMin - bedMin;   // bedMin נמדד מחצות של היום שלפני ההשכמה, וייתכן שעולה על 1440
    const asleep = Math.round(inPeriod * (clean ? 0.93 : 0.9) - (alcohol ? 20 : 0) - (lateCaf ? 25 : 0) + gauss(r) * (clean ? 6 : 12));
    const night = {
      date: D, bed: bedClock, wake: wakeClock, asleep_min: asleep, in_period_min: inPeriod, efficiency_pct: 88,
      hrv_ms: Math.round((40 + gauss(r) * (clean ? 2 : 3.5) - (alcohol ? 6 : 0) - (lateWo ? 4 : 0)) * 10) / 10,
      rhr_bpm: Math.round((55 + gauss(r) * (clean ? 0.6 : 1.1) + (alcohol ? 3 : 0) + (lateWo ? 2.5 : 0)) * 10) / 10,
      breathing_per_min: 14.2, skin_temp_dev_c: 0.1,
    };
    if (r() >= missingNight || k < 0) nightsBy[D] = night;
    // יומן של היום שלפני ההשכמה (D-1): נרשם ביום D-1
    const Y = addDays(D, -1);
    if (!logs[Y]) logs[Y] = { meals: [], workouts: [], checkin: null };
    if (r() < logRate || !events) {
      const L = logs[Y];
      const t = (h, m) => fmtHM(h * 60 + m);   // מנרמל גלישת דקות
      L.meals.push({ local_time: t(8, 10 + Math.floor(r() * 30)), kind: 'drink', name: 'קפה', kcal: null, caffeine_mg: 80, alcohol_g: null, glycemic_load: null });
      L.meals.push({ local_time: t(13, 0), kind: 'meal', name: 'צהריים', kcal: 650, caffeine_mg: 0, alcohol_g: 0, glycemic_load: 'medium' });
      if (lateCaf) L.meals.push({ local_time: t(16, 10 + Math.floor(r() * 60)), kind: 'drink', name: 'קפה', kcal: null, caffeine_mg: 80, alcohol_g: null, glycemic_load: null });
      if (preworkout) L.meals.push({ local_time: t(17, 0), kind: 'drink', name: 'פרה-וורקאוט', kcal: null, caffeine_mg: 200, alcohol_g: null, glycemic_load: null });
      L.meals.push({ local_time: lateMeal ? t(22, Math.floor(r() * 40)) : clean ? t(18, Math.floor(r() * 30)) : t(19, 30 + Math.floor(r() * 45)), kind: 'meal', name: 'ערב', kcal: 700, caffeine_mg: 0, alcohol_g: 0, glycemic_load: 'medium' });
      if (alcohol) L.meals.push({ local_time: t(20, 30), kind: 'drink', name: 'כוס יין', kcal: null, caffeine_mg: null, alcohol_g: 28, glycemic_load: null });
      if (lateWo) L.workouts.push({ local_time: t(20, 0), type: 'weights', duration_min: 55, rpe: 8 });
      else if (normalWo) L.workouts.push({ local_time: t(16, 30), type: 'cardio', duration_min: 50, rpe: 6 });
    }
  }
  return { nightsBy, logs, start, days };
}
export const nightsUpTo = (w, D) => Object.values(w.nightsBy).filter((n) => n.date <= D).sort((a, b) => (a.date < b.date ? 1 : -1));

