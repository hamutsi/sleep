// זיהוי: מה קרה אתמול (מבט אחורה), מה הנתונים מגלים (תגליות) ומה שווה לנסות (מיקוד).
// כללים דטרמיניסטיים בלבד, ללא מודל. הספים הם מדוחות המחקר B1 (סדירות ומשך) ו-B3 (קפאין, אלכוהול, אימון, ארוחה), והכללים R-* מצוינים ליד כל אחד.
// הקלט הוא נתונים פשוטים (לילות מ-nightsSummary ויומנים לפי תאריך), ולכן אפשר לבדוק הכול בסימולציה בלי שרת.
import { mean, median, sd, r1, nums, mm, bedAbs, fmtHM, midSleep, addDays, weekday } from './stats.js';

export const WO_HE = { weights: 'אימון כוח', cardio: 'אימון אירובי', walk: 'הליכה', other: 'אימון' };
const MIN = 60;

/* ---------- חשיפות של לילה: מה נרשם לפני השינה ---------- */
// D = תאריך ההשכמה. אירועים מהיום שלפני (D-1) ומהיום עצמו עד שעת ההירדמות (אם ההירדמות אחרי חצות)
export function exposureFor(D, bedHm, logs) {
  const bed = bedAbs(bedHm);
  const day1 = logs[addDays(D, -1)] || null;
  const day0 = logs[D] || null;
  const meals = [], works = [];
  for (const [L, base] of [[day1, 0], [day0, 24 * MIN]]) {
    if (!L) continue;
    for (const m of L.meals || []) { const t = base + mm(m.local_time); if (t <= bed && bed - t <= 18 * MIN) meals.push({ ...m, t }); }
    for (const w of L.workouts || []) { const t = base + mm(w.local_time); const end = t + (w.duration_min || 0); if (t <= bed && bed - end <= 18 * MIN) works.push({ ...w, t, end }); }
  }
  meals.sort((a, b) => a.t - b.t);
  works.sort((a, b) => a.end - b.end);
  // יומן ריק אינו "בלי קפה ובלי אלכוהול". רק כשיש רישום כלשהו מאותו יום אפשר להסיק היעדר
  const logged = !!(day1 && ((day1.meals || []).length || (day1.workouts || []).length));

  const cafs = meals.filter((m) => m.caffeine_mg > 0);
  let caf = null;
  if (cafs.length) {
    const last = cafs[cafs.length - 1];
    const within9 = cafs.filter((m) => bed - m.t <= 9 * MIN).reduce((a, m) => a + m.caffeine_mg, 0);
    const high = cafs.find((m) => m.caffeine_mg >= 200 && bed - m.t <= 13 * MIN);   // R-CAF-DOSE
    const dayTotal = ((day1 && day1.meals) || []).reduce((a, m) => a + (m.caffeine_mg || 0), 0);
    caf = {
      lastTime: last.local_time, lastGapH: r1((bed - last.t) / MIN), lastMg: last.caffeine_mg, within9Mg: within9,
      highTime: high ? high.local_time : null, highMg: high ? high.caffeine_mg : null, highGapH: high ? r1((bed - high.t) / MIN) : null, highName: high ? high.name : null,
      dayTotalMg: dayTotal, flag: high ? 'high' : within9 >= 60 ? 'soft' : null, totalFlag: dayTotal > 400,
    };
  }

  const alcs = meals.filter((m) => m.alcohol_g > 0);
  let alc = null;
  if (alcs.length) {
    const g = alcs.reduce((a, m) => a + m.alcohol_g, 0);
    const last = alcs[alcs.length - 1];
    alc = { g: r1(g), drinks: Math.round((g / 14) * 2) / 2, lastTime: last.local_time, gapH: r1((bed - last.t) / MIN), strong: g >= 17 || bed - last.t < 4 * MIN };   // R-ALC-ANY
  }

  let wo = null;
  if (works.length) {
    const lateOnes = works.filter((w) => w.rpe >= 7 && bed - w.end < 4 * MIN && bed - w.end >= -30).sort((a, b) => (bed - a.end) - (bed - b.end));
    const w = lateOnes[0] || works[works.length - 1];
    const gap = bed - w.end;
    wo = {
      type: w.type, typeHe: WO_HE[w.type] || 'אימון', duration: w.duration_min, rpe: w.rpe ?? null, start: w.local_time, end: fmtHM(w.end), gapH: r1(gap / MIN),
      late: w.rpe >= 7 && gap < 4 * MIN && gap >= -30 ? (gap < MIN ? 'strong' : 'flag') : null,                                   // R-EX-LATE
      ok: (w.rpe != null && w.rpe <= 6 && gap >= 2 * MIN) || gap >= 4 * MIN,                                                       // R-EX-OK
    };
  }

  const eaten = meals.filter((m) => m.kind === 'meal' || (m.kind === 'snack' && (m.kcal || 0) >= 200));
  let meal = null;
  if (eaten.length) {
    const last = eaten[eaten.length - 1];
    const gap = bed - last.t;
    meal = { lastTime: last.local_time, gapH: r1(gap / MIN), flag: gap < MIN ? 'strong' : gap < 3 * MIN ? 'flag' : gap < 4 * MIN ? 'soft' : null };   // R-MEAL-GAP
  }
  return { bed: bedHm, logged, caf, alc, wo, meal };
}

export const hasFlag = (e) => !!(e && ((e.caf && (e.caf.flag || e.caf.totalFlag)) || (e.alc) || (e.wo && e.wo.late) || (e.meal && e.meal.flag === 'strong') || (e.meal && e.meal.flag === 'flag')));

export const cutoffTime = (bedHm) => fmtHM(Math.floor((bedAbs(bedHm) - 9 * MIN) / 30) * 30);   // קפה אחרון 9 שעות לפני ההירדמות, מעוגל כלפי מטה לחצי שעה

/* ---------- בסיס אישי ---------- */
// משווים ללילות הקודמים. כשהלילה של היום כבר בנתונים (hasLatest), הוא לא נכלל בבסיס
export function baselines(nights, hasLatest = true) {
  const prev = hasLatest ? nights.slice(1, 15) : nights.slice(0, 14);
  const bed = nums(prev.map((n) => (n.bed ? bedAbs(n.bed) : null)));
  const wake = nums(prev.map((n) => (n.wake ? mm(n.wake) : null)));
  const hrv = nums(prev.map((n) => n.hrv_ms));
  const rhr = nums(prev.map((n) => n.rhr_bpm));
  return { n: prev.length, bedMed: median(bed), wakeMed: median(wake), hrvMean: mean(hrv), hrvSd: sd(hrv), hrvN: hrv.length, rhrMean: mean(rhr), rhrSd: sd(rhr), rhrN: rhr.length };
}

const band = (x) => (x <= 30 ? 'green' : x <= 60 ? 'amber' : 'red');

/* ---------- ניתוח לילות: חשיפות לכל לילה ---------- */
export function analyzeNights(nights, logs, usualBed) {
  return nights.map((n) => {
    const bedRef = n.bed || usualBed || null;
    return { night: n, exp: bedRef ? exposureFor(n.date, bedRef, logs) : null };
  });
}

/* ---------- מבט אחורה ---------- */
// night: הלילה האחרון (או null אם עוד לא הגיע מהשעון). bedRef: שעת הירדמות בפועל או הרגילה מהפרופיל
export function lookCandidates({ night, exp, base, avg7, cutBed }) {
  const c = [];
  const add = (key, sev, topics, params = {}) => c.push({ lane: 'look', key, sev, topics, params });
  if (!exp) return c;

  if (exp.caf) {
    if (exp.caf.flag === 'high') add('look:caf_high', 0.8, exp.caf.highName && /פרה/.test(exp.caf.highName) ? ['caffeine_timing', 'preworkout_caffeine'] : ['caffeine_timing'], { time: exp.caf.highTime, mg: exp.caf.highMg, gap: exp.caf.highGapH });
    else if (exp.caf.flag === 'soft') add('look:caf_soft', 0.45, ['caffeine_timing'], { time: exp.caf.lastTime, gap: exp.caf.lastGapH, cut: cutoffTime(cutBed || exp.bed) });
    if (exp.caf.totalFlag) add('look:caf_total', 0.55, ['caffeine_timing'], { mg: exp.caf.dayTotalMg });
  }

  if (exp.alc) {
    const p = { n: exp.alc.drinks, gap: exp.alc.gapH };
    if (night && night.rhr_bpm != null && base.rhrN >= 7 && night.rhr_bpm - base.rhrMean >= 2) { p.rhr = night.rhr_bpm; p.rhrBase = r1(base.rhrMean); }
    if (night && night.hrv_ms != null && base.hrvN >= 7 && night.hrv_ms <= base.hrvMean * 0.9) { p.hrv = night.hrv_ms; p.hrvBase = r1(base.hrvMean); }
    add('look:alcohol', exp.alc.strong ? 0.85 : 0.5, ['alcohol_sleep_hrv'], p);
  }

  if (exp.wo) {
    const p = { type: exp.wo.typeHe, rpe: exp.wo.rpe, end: exp.wo.end, gap: exp.wo.gapH };
    if (exp.wo.late) add('look:late_workout', exp.wo.late === 'strong' ? 0.9 : 0.75, ['exercise_timing_evening'], p);
    else if (exp.wo.ok) add('look:workout_ok', 0.25, ['exercise_timing_evening'], p);
  }

  if (exp.meal && exp.meal.flag) {
    if (exp.meal.flag === 'soft') add('look:meal_soft', 0.3, ['dinner_timing_late_eating'], { last: exp.meal.lastTime, gap: exp.meal.gapH });
    else add('look:meal_late', exp.meal.flag === 'strong' ? 0.8 : 0.6, ['dinner_timing_late_eating'], { last: exp.meal.lastTime, gap: exp.meal.gapH });
  }

  if (night && night.bed && base.n >= 5 && base.bedMed != null) {
    const d = bedAbs(night.bed) - base.bedMed;
    if (d >= 60) add('look:bed_late', 0.5, ['sleep_regularity'], { bed: night.bed, median: fmtHM(base.bedMed), diff: Math.round(d) });
  }
  if (night && night.wake && base.n >= 5 && base.wakeMed != null) {
    const d = mm(night.wake) - base.wakeMed;
    if (Math.abs(d) >= 60) add('look:wake_shift', 0.5, ['sleep_regularity', 'social_jetlag'], { wake: night.wake, median: fmtHM(base.wakeMed), diff: Math.round(Math.abs(d)), later: d > 0 });
  }

  // הסברים אפשריים מהיומן, לפני שמפרשים HRV או דופק (R-EXPLAIN)
  const expl = [];
  if (exp.alc) expl.push('אלכוהול');
  if (exp.wo && exp.wo.late) expl.push(`${exp.wo.typeHe} שנגמר ב-${exp.wo.end}`);
  if (exp.meal && exp.meal.flag && exp.meal.flag !== 'soft') expl.push(`ארוחה ב-${exp.meal.lastTime}`);
  if (exp.caf && exp.caf.flag === 'high') expl.push(`קפאין ב-${exp.caf.highTime}`);
  // חריגה מהבסיס נחשבת רק אם היא גדולה גם מהרעש הרגיל של המשתמש עצמו (HRV נודד הרבה מלילה ללילה)
  if (night && night.hrv_ms != null && base.hrvN >= 7 && night.hrv_ms <= base.hrvMean * 0.85 && (base.hrvSd == null || base.hrvMean - night.hrv_ms >= 1.5 * base.hrvSd))
    add('look:hrv_dip', 0.45, ['hrv_rhr_recovery'], { hrv: night.hrv_ms, base: r1(base.hrvMean), pct: Math.round((1 - night.hrv_ms / base.hrvMean) * 100), expl: expl.join(', ') });
  if (night && night.rhr_bpm != null && base.rhrN >= 7 && night.rhr_bpm - base.rhrMean >= 4 && (base.rhrSd == null || night.rhr_bpm - base.rhrMean >= 2 * base.rhrSd))
    add('look:rhr_up', 0.5, ['hrv_rhr_recovery'], { rhr: night.rhr_bpm, base: r1(base.rhrMean), diff: r1(night.rhr_bpm - base.rhrMean), expl: expl.join(', ') });

  const flagged = hasFlag(exp);
  if (night && night.asleep_min != null) {
    if (night.asleep_min >= 7 * MIN && !flagged && !c.some((x) => ['look:hrv_dip', 'look:rhr_up', 'look:bed_late', 'look:wake_shift'].includes(x.key))) {
      const reasons = [];
      if (exp.caf && exp.caf.lastGapH >= 9) reasons.push(`קפה אחרון ב-${exp.caf.lastTime}`);
      if (exp.logged && !exp.alc) reasons.push('בלי אלכוהול');
      if (exp.wo && exp.wo.ok) reasons.push(`${exp.wo.typeHe} שהסתיים ${exp.wo.gapH} שעות לפני השינה`);
      if (exp.meal && !exp.meal.flag) reasons.push(`ארוחה אחרונה ${exp.meal.gapH} שעות לפני השינה`);
      if (reasons.length >= 2) add('look:good_night', 0.4, ['sleep_regularity'], { reasons: reasons.slice(0, 3), asleep: r1(night.asleep_min / MIN), bed: night.bed, wake: night.wake });
    }
    if (night.asleep_min < 6.5 * MIN && exp.logged && !flagged) add('look:no_explainer_poor', 0.5, ['sleep_duration_need', 'wearable_accuracy'], { asleep: r1(night.asleep_min / MIN), avg7: avg7 == null ? null : r1(avg7 / MIN) });
  }
  if (!exp.logged) add('look:no_log', 0.2, [], {});
  return c;
}

/* ---------- תגליות בנתונים ---------- */
export function discCandidates({ nights, per, profile }) {
  const c = [];
  const add = (key, sev, topics, params = {}) => c.push({ lane: 'disc', key, sev, topics, params });
  const n = nights.length;
  if (n < 5) { add('disc:collecting', 0.3, ['n_of_1_experiments'], { n }); return c; }

  const n7 = nights.slice(0, 7);
  const bedL = nums(n7.map((x) => (x.bed ? bedAbs(x.bed) : null)));
  const wakeL = nums(n7.map((x) => (x.wake ? mm(x.wake) : null)));
  const sdBed = bedL.length >= 5 ? sd(bedL) : null, sdWake = wakeL.length >= 5 ? sd(wakeL) : null;
  if (sdBed != null && sdWake != null) {
    const b = band(Math.max(sdBed, sdWake));
    add('disc:regularity', b === 'green' ? 0.35 : b === 'amber' ? 0.55 : 0.8, b === 'green' ? ['sleep_regularity'] : ['sleep_regularity', 'prediabetes_sleep_glucose'], { sdBed: Math.round(sdBed), sdWake: Math.round(sdWake), band: b, n: n7.length });
  }

  const asleep7 = nums(n7.map((x) => x.asleep_min));
  const asleep14 = nums(nights.slice(0, 14).map((x) => x.asleep_min));
  if (asleep7.length >= 5) {
    const a7 = mean(asleep7) / MIN, a14 = asleep14.length >= 10 ? mean(asleep14) / MIN : null;
    const low = a7 < 6.5 && a14 != null && a14 < 6.5;
    const b = low ? 'low' : a7 < 7 ? 'near' : 'ok';
    add('disc:duration', low ? 0.7 : b === 'near' ? 0.4 : 0.3, ['sleep_duration_need'], { avg7: r1(a7), avg14: a14 == null ? null : r1(a14), band: b });
  }

  // ג'ט לג חברתי: אמצע שינה בליל שישי ושבת (השכמה ביום שישי או שבת) מול ימי העבודה. ראשון עד חמישי הם ימי העבודה
  const n28 = nights.slice(0, 28).filter((x) => x.bed && x.wake);
  if (n28.length >= 21) {
    const free = n28.filter((x) => [5, 6].includes(weekday(x.date))).map((x) => midSleep(x.bed, x.wake));
    const work = n28.filter((x) => ![5, 6].includes(weekday(x.date))).map((x) => midSleep(x.bed, x.wake));
    if (free.length >= 3 && work.length >= 8) {
      const d = mean(free) - mean(work);
      if (Math.abs(d) >= 60) add('disc:social_jetlag', Math.abs(d) >= 120 ? 0.75 : 0.5, ['social_jetlag'], { diff: Math.round(Math.abs(d)), later: d > 0 });
    }
  }

  if (profile && profile.usual_bed && bedL.length >= 5) {
    const med = median(bedL);
    if (Math.abs(med - bedAbs(profile.usual_bed)) >= 30) add('disc:bed_vs_usual', 0.45, ['sleep_regularity'], { usual: profile.usual_bed, median: fmtHM(med) });
  }

  // אותות אישיים: השוואה בין לילות, כהתבוננות ולא כהוכחה. דורשים מינימום לילות בכל צד ואפקט ממשי
  const win = per.slice(0, 28).filter((p) => p.exp && p.exp.logged);
  const rhrOf = (p) => p.night.rhr_bpm, hrvOf = (p) => p.night.hrv_ms;
  const split = (pred) => { const a = win.filter(pred), b = win.filter((p) => !pred(p)); return [a, b]; };
  const diffOf = (a, b, f) => { const x = nums(a.map(f)), y = nums(b.map(f)); return x.length >= 3 && y.length >= 3 ? { d: mean(x) - mean(y), nA: x.length, nB: y.length } : null; };

  const [alcN, alcNo] = split((p) => p.exp.alc);
  if (alcN.length >= 3 && alcNo.length >= 7) {
    const r = diffOf(alcN, alcNo, rhrOf), hv = diffOf(alcN, alcNo, hrvOf);
    if (r && r.d >= 1.5) add('disc:alcohol_signal', 0.6, ['alcohol_sleep_hrv'], { nA: alcN.length, nN: alcNo.length, rhrDiff: r1(r.d), hrvDiff: hv && hv.d <= -3 ? r1(-hv.d) : null });
  }
  const [cafL, cafO] = split((p) => p.exp.caf && p.exp.caf.within9Mg >= 60);
  if (cafL.length >= 5 && cafO.length >= 5) {
    const r = diffOf(cafO, cafL, (p) => p.night.asleep_min);
    const spread = sd(nums(win.map((p) => p.night.asleep_min)));
    if (r && r.d >= 20 && spread != null && r.d >= 0.5 * spread) add('disc:caffeine_signal', 0.55, ['caffeine_timing', 'n_of_1_experiments'], { nLate: cafL.length, nOther: cafO.length, diffMin: Math.round(r.d) });
  }
  const [woL, woO] = split((p) => p.exp.wo && p.exp.wo.late);
  if (woL.length >= 3 && woO.length >= 7) {
    const r = diffOf(woL, woO, rhrOf);
    if (r && r.d >= 2) add('disc:workout_signal', 0.5, ['exercise_timing_evening'], { nLate: woL.length, nOther: woO.length, rhrDiff: r1(r.d) });
  }

  const hrvAll = nights.slice(0, 28).map((x) => x.hrv_ms);
  if (nums(hrvAll).length >= 21) {
    const last7 = nums(hrvAll.slice(0, 7)), rest = nums(hrvAll.slice(7));
    if (last7.length >= 5 && rest.length >= 14) {
      const pct = ((mean(last7) - mean(rest)) / mean(rest)) * 100;
      if (Math.abs(pct) >= 8) add('disc:hrv_trend', 0.4, ['hrv_rhr_recovery'], { up: pct > 0, pct: Math.round(Math.abs(pct)), mean7: r1(mean(last7)), mean28: r1(mean(rest)) });
    }
  }
  const rhrAll = nights.slice(0, 28).map((x) => x.rhr_bpm);
  if (nums(rhrAll).length >= 21) {
    const last7 = nums(rhrAll.slice(0, 7)), rest = nums(rhrAll.slice(7));
    if (last7.length >= 5 && rest.length >= 14) {
      const d = mean(last7) - mean(rest);
      if (Math.abs(d) >= 2) add('disc:rhr_trend', 0.4, ['hrv_rhr_recovery'], { up: d > 0, diff: r1(Math.abs(d)), mean7: r1(mean(last7)), mean28: r1(mean(rest)) });
    }
  }

  // רצף השכמות בטווח של חצי שעה מהחציון
  const wk14 = nums(nights.slice(0, 14).map((x) => (x.wake ? mm(x.wake) : null)));
  if (wk14.length >= 7) {
    const med = median(wk14);
    let streak = 0;
    for (const x of nights) { if (x.wake && Math.abs(mm(x.wake) - med) <= 30) streak++; else break; }
    if (streak >= 4) add('disc:streak', 0.4, ['sleep_regularity'], { n: streak, median: fmtHM(med) });
  }
  return c;
}

/* ---------- מיקוד שבועי: דבר אחד בכל פעם, לפי סדר ההשפעה ב-B3 סעיף 6.2 ---------- */
export function moveCandidates({ nights, per, profile }) {
  const c = [];
  const add = (key, sev, topics, params = {}) => c.push({ lane: 'move', key, sev, topics, params });
  const last14 = per.slice(0, 14).filter((p) => p.exp);
  const cnt = (f) => last14.filter((p) => f(p.exp)).length;
  const asleep7 = nums(nights.slice(0, 7).map((x) => x.asleep_min));
  const wake7 = nums(nights.slice(0, 7).map((x) => (x.wake ? mm(x.wake) : null)));
  const wakeTarget = profile && profile.usual_wake ? profile.usual_wake : wake7.length >= 3 ? fmtHM(median(wake7)) : null;
  const bedRef = (profile && profile.usual_bed) || (nights[0] && nights[0].bed) || '23:15';

  if (asleep7.length >= 5 && mean(asleep7) < 6.5 * MIN) add('move:earlier_bed', 0.95, ['sleep_duration_need'], { target: fmtHM(bedAbs(bedRef) - 30) });
  if (cnt((e) => e.alc) >= 2) add('move:alcohol', 0.9, ['alcohol_sleep_hrv']);
  if (cnt((e) => e.wo && e.wo.late) >= 2) add('move:workout_buffer', 0.85, ['exercise_timing_evening']);
  if (cnt((e) => e.caf && (e.caf.flag || e.caf.totalFlag)) >= 3) add('move:coffee_cutoff', 0.8, ['caffeine_timing'], { cut: cutoffTime(bedRef) });
  if (wake7.length >= 5 && sd(wake7) > 30) add('move:fixed_wake', 0.75, ['sleep_regularity', 'morning_light_circadian'], { target: wakeTarget });
  if (cnt((e) => e.meal && (e.meal.flag === 'flag' || e.meal.flag === 'strong')) >= 3) add('move:dinner_gap', 0.6, ['dinner_timing_late_eating']);
  // בלי חשיפה בולטת: מיקוד תחזוקה. השכמה קבועה היא ברירת המחדל כשעוד אין נתונים (B1: יעד ההתנהגות הראשי)
  add('move:fixed_wake', 0.5, ['sleep_regularity', 'morning_light_circadian'], { target: wakeTarget });
  add('move:morning_light', 0.4, ['morning_light_circadian']);
  add('move:post_meal_walk', 0.38, ['post_meal_walk']);
  add('move:wind_down', 0.35, ['stress_breathing_wind_down']);
  // כפילויות (אותו מפתח פעמיים) נשארות עם הדרגה הגבוהה
  const seen = new Map();
  for (const x of c) if (!seen.has(x.key) || seen.get(x.key).sev < x.sev) seen.set(x.key, x);
  return [...seen.values()].sort((a, b) => b.sev - a.sev);
}
