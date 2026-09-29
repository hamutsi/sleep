// מחסנית התובנות היומית. מקבלת נתונים והיסטוריה ומחזירה 3 עד 5 כרטיסים שמשתנים מיום ליום:
//   מבט אחורה (מה קרה אתמול), בנתונים שלך (תגלית), מחקר היום (עובדה מהספרייה המאומתת), צעד קטן (מיקוד שבועי), וסיכום שבוע בשישי.
// כללי גיוון: זמן צינון לכל מפתח, בדיקת דמיון טקסט מול 14 הימים האחרונים, סיבוב גרסאות, משוב (כבר ידעתי, עוד כאלה, לא רלוונטי),
// ו"יום שקט" כנה כשאין מה לומר. הכול דטרמיניסטי לפי (תאריך, נתונים, היסטוריה), ולכן אפשר לבדוק בסימולציה ורענון לא משנה את הכרטיסים.
import { mean, nums, mm, bedAbs, sd, addDays, weekday, daysBetween, hash32, num, fmtHM } from './stats.js';
import { exposureFor, baselines, analyzeNights, lookCandidates, discCandidates, moveCandidates } from './detect.js';
import { LANES, RESEARCH_LABELS, render, variantCount, renderMove, FOCUS_NAME } from './copy.js';

const COOLDOWN = { look: 2, disc: 6 };                 // ימים עד שאותו מפתח יכול להופיע שוב
const KEY_COOLDOWN = { 'disc:collecting': 1 };
const SIM_MAX = 0.6;                                   // דמיון טקסט מרבי מול 14 הימים האחרונים
const FOCUS_DAYS = 7;
const RESEARCH_DAYS = 21, SENSITIVE_DAYS = 45;
const FB_DAYS = { known: 60, irrelevant: 120, more: 30 };
const STRENGTH_W = { strong: 1.0, moderate: 0.7, limited: 0.3, method: 0.5 };
// נושאים רפואיים או רגישים: בתדירות נמוכה ולא יותר מאחד בשבוע, כדי שלא ירגיש כמו אבחון או כמו תזכורת יומית לתרופה
const SENSITIVE = new Set(['statin_and_sleep', 'statin_muscle_symptoms', 'statin_and_blood_sugar', 'statin_food_interactions', 'melatonin_facts', 'magnesium_supplements_sleep',
  'sleep_apnea_signs_men', 'nocturia_prostate_sleep', 'labs_annual_recheck_prediabetes', 'ferritin_and_restless_legs']);
// נושאים שנפתחים רק ביוזמה של המשתמש (חיפוש בספרייה, או שאלה למאמן), ולא כ"מחקר היום": תופעות לוואי של תרופה, אינטראקציות ותוספים.
// מאמן שינה לא מציע ביוזמתו נושא של תרופות או תוספים (R-MED-3), וגם לא צריך להזכיר סטטין כמחקר יומי אקראי
const PULL_ONLY = new Set(['statin_muscle_symptoms', 'statin_food_interactions', 'melatonin_facts', 'magnesium_supplements_sleep']);
const RELEVANT = new Set(['prediabetes_sleep_glucose', 'post_meal_walk', 'sleep_heart_health', 'sleep_regularity']);   // קרובים לפרופיל: טרום סוכרת, כולסטרול

// ערכת נושאים לכל יום בשבוע (0 = ראשון). מטה רך של +1.2 בבחירת מחקר היום, לא הגבלה
export const THEMES = {
  0: ['sleep_regularity', 'morning_light_circadian', 'tiny_changes_experiments', 'n_of_1_experiments'],
  1: ['sleep_stages_aging', 'wearable_accuracy', 'orthosomnia_tracker_anxiety', 'melatonin_facts', 'magnesium_supplements_sleep', 'naps_rules'],
  2: ['hrv_rhr_recovery', 'overtraining_recovery_signals', 'sleep_heart_health', 'prediabetes_sleep_glucose', 'sleep_muscle_recovery'],
  3: ['caffeine_timing', 'dinner_timing_late_eating', 'exercise_timing_evening', 'bedroom_temperature_warm_bath', 'evening_light_screens', 'evening_carbs_protein'],
  4: ['social_jetlag', 'sleep_regularity', 'chronotype_and_midlife', 'alcohol_sleep_hrv', 'alcohol_and_sleep_apnea'],
  5: ['sleep_duration_need', 'sleep_heart_health', 'lifting_and_sleep_quality', 'time_restricted_eating_sleep'],
  6: ['stress_breathing_wind_down', 'naps_rules', 'cbt_i_basics', 'post_meal_walk'],
};

const words = (s) => new Set(String(s).replace(/[0-9.:,"'()\-׳״]/g, ' ').split(/\s+/).filter((w) => w.length > 1));
const jaccard = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };
const later = (a, b) => (!a || b > a ? b : a);

// משוב שנשמר בהיסטוריה הופך לחסימות והעדפות (תאריכי ISO, אפשר להשוות כמחרוזות)
function suppression(H, date) {
  const key = new Map(), topic = new Map(), boost = new Map();
  for (const c of H) {
    if (!c.feedback) continue;
    if (c.feedback === 'known' || c.feedback === 'irrelevant') {
      const d = c.lane === 'research' ? Math.max(FB_DAYS[c.feedback], 90) : FB_DAYS[c.feedback];
      const until = addDays(c.date, d);
      key.set(c.key, later(key.get(c.key), until));
      if (c.lane === 'research') for (const t of c.topics || []) topic.set(t, later(topic.get(t), until));
    } else if (c.feedback === 'more') {
      for (const t of c.topics || []) boost.set(t, later(boost.get(t), addDays(c.date, FB_DAYS.more)));
    }
  }
  return {
    isSuppressedKey: (k) => (key.get(k) || '') > date,
    isSuppressedTopic: (t) => (topic.get(t) || '') > date,
    boostOf: (t) => ((boost.get(t) || '') > date ? 1.5 : 0),
  };
}

// סדר ניסיון לגרסאות: קודם אלה שלא הופיעו לאחרונה (בסיבוב לפי גיבוב התאריך), ואז אלה שהופיעו, מהישנה לחדשה
function variantOrder(n, used, seed) {
  const usedSet = new Set(used);
  const fresh = [...Array(n).keys()].filter((i) => !usedSet.has(i));
  const rot = fresh.length ? seed % fresh.length : 0;
  const first = fresh.slice(rot).concat(fresh.slice(0, rot));
  const rest = used.slice().reverse().filter((v, i, a) => v < n && a.indexOf(v) === i);
  return first.concat(rest);
}

// מיקוד פעיל: הרצף האחרון של אותו כרטיס צעד. הפסקה של יותר מ-3 ימים מסיימת אותו
function focusState(H, date) {
  const moves = H.filter((c) => c.lane === 'move');   // H ממוין מהחדש לישן
  if (!moves.length) return null;
  const last = moves[0];
  if (daysBetween(last.date, date) > 3) return null;
  let start = last.date, prev = last.date;
  for (const c of moves) {
    if (c.key !== last.key || daysBetween(c.date, prev) > 3) break;
    start = c.date; prev = c.date;
  }
  return { key: last.key, start, day: daysBetween(start, date) + 1, topics: last.topics, params: last.params };
}

const hebTone = (x) => (x <= 30 ? 'good' : x <= 60 ? 'warn' : 'bad');

export function composeDay({ date, nights = [], logs = {}, profile = {}, history = [], library = [], glucoseCtx = 'בטרום סוכרת' }) {
  const H = history.filter((c) => c.date < date).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const known = new Set(library.map((t) => t.id));
  const topicsOf = (ids) => (ids || []).filter((id) => known.has(id));
  const lastNight = nights[0] && nights[0].date === date ? nights[0] : null;
  const sup = suppression(H, date);
  const per = analyzeNights(nights, logs, profile.usual_bed);
  const bedRef = lastNight ? lastNight.bed : profile.usual_bed || null;
  const exp = bedRef ? exposureFor(date, bedRef, logs) : null;
  const base = baselines(nights, !!lastNight);
  const avg7 = mean(nums(nights.slice(0, 7).map((n) => n.asleep_min)));

  const recentTopics = new Set();
  for (const c of H) if (daysBetween(c.date, date) <= 2) for (const t of c.topics || []) recentTopics.add(t);
  const daysSince = (k) => { const c = H.find((x) => x.key === k); return c ? daysBetween(c.date, date) : Infinity; };
  const score = (c) => c.sev - 0.1 * (c.topics || []).filter((t) => recentTopics.has(t)).length + ((hash32(date + c.key) % 1000) / 1000) * 0.04;
  const eligible = (c) => !sup.isSuppressedKey(c.key) && daysSince(c.key) >= (KEY_COOLDOWN[c.key] ?? COOLDOWN[c.lane] ?? 0);
  const recentSets = H.filter((c) => daysBetween(c.date, date) <= 14).map((c) => words(`${c.title} ${c.body}`));
  const fresh = (t) => { const w = words(`${t.title} ${t.body}`); return recentSets.every((r) => jaccard(w, r) < SIM_MAX); };

  // הטקסטים בכרטיסים שלנו מנוסחים לטרום סוכרת. בפריסה אחרת מחליפים את הביטוי לפי הפרופיל. כרטיס מחקר מצטט את הספרייה כמו שהיא
  const loc = (c, s) => (c.lane === 'research' ? s : String(s).replace(/בטרום סוכרת/g, glucoseCtx));
  const mk = (c, t, extra = {}) => ({
    id: `${date}:${c.lane}`, date, lane: c.lane, key: c.key, topics: topicsOf(c.topics), variant: t.variant ?? 0, title: loc(c, t.title), body: loc(c, t.body),
    params: c.params || {}, sev: c.sev ?? 0, emoji: LANES[c.lane].emoji, label: LANES[c.lane].label, ...extra,
  });

  function tryRender(c) {
    const n = variantCount(c.key, c.params);
    if (!n) return null;
    const used = H.filter((x) => x.key === c.key).slice(0, 3).map((x) => x.variant);
    for (const v of variantOrder(n, used, hash32(date + c.key))) {
      const t = render(c.key, c.params, v);
      if (t && fresh(t)) return { ...t, variant: v };
    }
    return null;
  }
  const take = (cands) => {
    for (const c of cands.filter(eligible).sort((a, b) => score(b) - score(a))) { const t = tryRender(c); if (t) return mk(c, t); }
    return null;
  };

  // שעת "קפה אחרון עד" נגזרת מהשעה הרגילה (פרופיל, או חציון הלילות), כדי שלא תקפוץ כל יום עם שעת ההירדמות של אתמול
  const cutBed = profile.usual_bed || (base.bedMed != null ? fmtHM(base.bedMed) : null);
  const look = take(exp ? lookCandidates({ night: lastNight, exp, base, avg7, cutBed }) : []);
  const disc = take(discCandidates({ nights, per, profile }));

  // צעד קטן: ממשיכים מיקוד פעיל עד 7 ימים, ואז בוחרים חדש לפי סדר ההשפעה, בלי לחזור על מיקוד מ-21 הימים האחרונים
  let move = null;
  {
    const cands = moveCandidates({ nights, per, profile });
    const fs = focusState(H, date);
    let choice, day;
    if (fs && fs.day <= FOCUS_DAYS && !sup.isSuppressedKey(fs.key)) {
      const f = cands.find((c) => c.key === fs.key);
      choice = { key: fs.key, topics: f ? f.topics : fs.topics, params: f ? f.params : fs.params || {}, sev: 0.5 };
      day = fs.day;
    } else {
      // מיקוד חדש: לא זה שהסתיים עכשיו. קודם מי שלא היה ב-21 הימים האחרונים (לפי סדר ההשפעה), ואם אין, זה שלא היה הכי הרבה זמן
      const lastUse = new Map();
      for (const c of H) if (c.lane === 'move' && !lastUse.has(c.key)) lastUse.set(c.key, c.date);
      const pool = cands.filter((c) => !sup.isSuppressedKey(c.key) && c.key !== (fs && fs.key));
      const notRecent = pool.filter((c) => !lastUse.has(c.key) || daysBetween(lastUse.get(c.key), date) > 21);
      choice = notRecent[0] || pool.slice().sort((a, b) => ((lastUse.get(a.key) || '') < (lastUse.get(b.key) || '') ? -1 : 1))[0] || null;
      day = 1;
    }
    if (choice) { const t = renderMove(choice.key, choice.params, day); if (t) move = mk({ ...choice, lane: 'move' }, t, { data: { day, name: FOCUS_NAME[choice.key] || '' } }); }
  }

  // סיכום שבוע: בשישי, ובשבת אם לא נוצר כבר
  let weekly = null;
  const wd = weekday(date);
  if ((wd === 5 || (wd === 6 && !H.some((c) => c.lane === 'weekly' && daysBetween(c.date, date) < 6))) && nights.length >= 3) {
    const n7 = nights.slice(0, 7);
    const asleep = nums(n7.map((n) => n.asleep_min));
    const avgH = asleep.length ? mean(asleep) / 60 : null;
    const bedL = nums(n7.map((n) => (n.bed ? bedAbs(n.bed) : null))), wakeL = nums(n7.map((n) => (n.wake ? mm(n.wake) : null)));
    const sdBed = bedL.length >= 4 ? sd(bedL) : null, sdWake = wakeL.length >= 4 ? sd(wakeL) : null;
    const logged = per.slice(0, 7).filter((p) => p.exp && p.exp.logged);
    const alcN = logged.filter((p) => p.exp.alc).length;
    const cafN = logged.filter((p) => p.exp.caf && p.exp.caf.flag).length;
    const lateN = per.slice(0, 7).filter((p) => p.exp && p.exp.wo && p.exp.wo.late).length;
    let workouts = 0;
    for (let i = 0; i < 7; i++) { const L = logs[addDays(date, -i)]; if (L) workouts += (L.workouts || []).length; }
    const rows = [{ label: 'לילות עם נתונים', value: `${n7.length} מתוך 7`, tone: '' }];
    if (avgH != null) rows.push({ label: 'ממוצע שינה', value: `${num(Math.round(avgH * 10) / 10)} שעות`, tone: avgH >= 7 ? 'good' : avgH >= 6.5 ? 'warn' : 'bad' });
    if (sdBed != null) rows.push({ label: 'סדירות ההירדמות', value: `${Math.round(sdBed)} דק׳`, tone: hebTone(sdBed) });
    if (sdWake != null) rows.push({ label: 'סדירות ההשכמה', value: `${Math.round(sdWake)} דק׳`, tone: hebTone(sdWake) });
    if (logged.length >= 3) { rows.push({ label: 'לילות אחרי אלכוהול', value: String(alcN), tone: alcN === 0 ? 'good' : '' }); rows.push({ label: 'קפה בטווח 9 שעות', value: String(cafN), tone: cafN === 0 ? 'good' : '' }); }
    if (workouts) rows.push({ label: 'אימונים', value: lateN ? `${workouts} (${lateN} קשים ומאוחרים)` : String(workouts), tone: lateN ? 'warn' : '' });
    const regGreen = sdBed != null && sdWake != null && Math.max(sdBed, sdWake) <= 30;
    const highlight = regGreen ? 'הסדירות השבוע הייתה בטווח הירוק, וזה ההישג שהמחקר קושר הכי חזק לבריאות.'
      : logged.length >= 4 && alcN === 0 ? 'שבוע בלי אלכוהול בלילות שנרשמו, וזה בדיוק מה שהדופק אוהב.'
      : avgH != null && avgH >= 7 ? 'ממוצע השינה עמד ביעד של 7 שעות ומעלה.'
      : 'כל שבוע מוסיף נקודת מידע. מה שחשוב הוא המגמה לאורך כמה שבועות ולא שבוע אחד.';
    const focus = move && move.data && move.data.name ? ` המיקוד הנוכחי: ${move.data.name}.` : '';
    weekly = mk({ lane: 'weekly', key: 'weekly:summary', topics: ['sleep_regularity'], sev: 1, params: {} }, { title: 'סיכום השבוע', body: `${highlight}${focus}`, variant: 0 }, { data: { rows } });
  }

  // מחקר היום: נושא ווו שלא הוצגו לאחרונה, לפי חוזק ראיות, ערכת היום, קרבה לפרופיל ומשוב
  let research = null;
  if (library.length) {
    const taken = new Set([look, disc, move, weekly].filter(Boolean).flatMap((c) => c.topics));
    const theme = THEMES[wd] || [];
    const shown = new Map();
    for (const c of H) if (c.lane === 'research' && c.topics && c.topics[0]) { const t = c.topics[0]; if (!shown.has(t)) shown.set(t, []); shown.get(t).push({ date: c.date, hook: c.variant }); }
    const sensitiveRecent = H.some((c) => c.lane === 'research' && SENSITIVE.has((c.topics || [])[0]) && daysBetween(c.date, date) < 7);
    const scored = [];
    for (const t of library) {
      if (!t.hooks || !t.hooks.length || taken.has(t.id) || PULL_ONLY.has(t.id) || sup.isSuppressedTopic(t.id)) continue;
      const hist = shown.get(t.id) || [];
      if (hist.length && daysBetween(hist[0].date, date) < (SENSITIVE.has(t.id) ? SENSITIVE_DAYS : RESEARCH_DAYS)) continue;
      if (SENSITIVE.has(t.id) && sensitiveRecent) continue;
      const usedHooks = new Set(hist.map((x) => x.hook));
      let idx = t.hooks.findIndex((_, i) => !usedHooks.has(i));
      if (idx < 0) idx = hist.length ? hist[hist.length - 1].hook % t.hooks.length : 0;   // כל הווים נוצלו: חוזרים לישן ביותר
      const s = (STRENGTH_W[t.strength] ?? 0.3) + (theme.includes(t.id) ? 1.2 : 0) + sup.boostOf(t.id) + (RELEVANT.has(t.id) ? 0.3 : 0) + (hist.length ? 0 : 0.6) + ((hash32(date + t.id) % 1000) / 1000) * 0.5;
      scored.push({ t, idx, s });
    }
    scored.sort((a, b) => b.s - a.s);
    for (const { t, idx } of scored) {
      const body = t.hooks[idx];
      if (!fresh({ title: t.title, body })) continue;
      const label = RESEARCH_LABELS[hash32(date) % RESEARCH_LABELS.length];
      research = mk({ lane: 'research', key: `res:${t.id}`, topics: [t.id], sev: 0.5, params: {} }, { title: t.title, body, variant: idx }, { label, data: { strength: t.strength } });
      break;
    }
  }

  // יום שקט: כשאין מבט אחורה ואין תגלית, אומרים את זה בכנות ולא ממציאים המלצה
  let quiet = null;
  if (!look && !disc && lastNight && !sup.isSuppressedKey('quiet:stable')) {
    const c = { lane: 'quiet', key: 'quiet:stable', topics: ['sleep_regularity'], sev: 0.1, params: {} };
    const t = tryRender(c);
    if (t) quiet = mk(c, t);
  }

  const cards = [weekly, look, disc || quiet, research, move].filter(Boolean);
  return {
    date, hasSleep: !!lastNight, cards,
    notes: { nights: nights.length, basis: lastNight ? 'measured' : exp ? 'logged' : 'none', libraryTopics: library.length, weekday: wd },
  };
}
