// בדיקות למנוע התובנות היומי. לא דורש שרת: הכול פונקציות טהורות.
// כולל סימולציה של 60 יום סינתטיים, שהיא מבחן הקבלה לדרישה "התובנות חייבות להתחלף כל יום ולא לשעמם".
// הרצה:  node tests/insights.test.mjs
import { composeDay, THEMES } from '../src/insights/compose.js';
import { exposureFor, cutoffTime, lookCandidates, discCandidates, moveCandidates, analyzeNights, baselines } from '../src/insights/detect.js';
import { render, renderMove, variantsOf, variantCount, FOCUS_NAME, LANES } from '../src/insights/copy.js';
import { addDays, weekday, daysBetween, mm, fmtHM, bedAbs, midSleep } from '../src/insights/stats.js';
import { IDS, rng, LIB, world, nightsUpTo } from './insights_world.mjs';

let pass = 0, fail = 0;
const ok = (c, m, extra) => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'} ${m}${!c && extra !== undefined ? '\n     ' + String(extra).slice(0, 500) : ''}`); };

/* ---------- 1. חשיפות ובדיקות יחידה ---------- */
const meal = (time, extra = {}) => ({ local_time: time, kind: 'drink', name: 'x', kcal: null, caffeine_mg: null, alcohol_g: null, ...extra });
{
  const D = '2026-09-29', Y = '2026-09-28';
  let e = exposureFor(D, '23:30', { [Y]: { meals: [meal('17:00', { name: 'פרה-וורקאוט', caffeine_mg: 200 })], workouts: [] } });
  ok(e.caf.flag === 'high' && e.caf.highGapH === 6.5 && e.caf.lastGapH === 6.5, 'קפאין 200 מ״ג ב-17:00 לפני שינה ב-23:30: דגל high, פער 6.5 שעות', JSON.stringify(e.caf));
  e = exposureFor(D, '23:30', { [Y]: { meals: [meal('16:00', { caffeine_mg: 80 })], workouts: [] } });
  ok(e.caf.flag === 'soft' && e.caf.lastGapH === 7.5, 'קפה אחד (80 מ״ג) 7.5 שעות לפני: דגל soft');
  e = exposureFor(D, '23:30', { [Y]: { meals: [meal('12:00', { caffeine_mg: 80 })], workouts: [] } });
  ok(e.caf.flag === null && e.logged, 'קפה 11.5 שעות לפני: בלי דגל');
  e = exposureFor(D, '23:30', { [Y]: { meals: [meal('08:00', { caffeine_mg: 200 }), meal('09:00', { caffeine_mg: 200 }), meal('11:00', { caffeine_mg: 80 })], workouts: [] } });
  ok(e.caf.dayTotalMg === 480 && e.caf.totalFlag === true, 'סך קפאין ביום מעל 400: דגל totalFlag');
  e = exposureFor(D, '23:30', { [Y]: { meals: [meal('20:30', { alcohol_g: 28 })], workouts: [] } });
  ok(e.alc.strong === true && e.alc.drinks === 2 && e.alc.gapH === 3, 'שני משקאות 3 שעות לפני שינה: alcohol strong');
  e = exposureFor(D, '23:30', { [Y]: { meals: [meal('17:00', { alcohol_g: 7 })], workouts: [] } });
  ok(e.alc.strong === false && e.alc.drinks === 0.5, 'חצי משקאות 6.5 שעות לפני: לא strong');
  e = exposureFor(D, '23:30', { [Y]: { meals: [], workouts: [{ local_time: '20:00', type: 'weights', duration_min: 55, rpe: 8 }] } });
  ok(e.wo.late === 'flag' && e.wo.end === '20:55' && e.wo.gapH === 2.6, 'אימון קשה שנגמר 20:55: דגל late', JSON.stringify(e.wo));
  e = exposureFor(D, '23:30', { [Y]: { meals: [], workouts: [{ local_time: '22:00', type: 'weights', duration_min: 45, rpe: 8 }] } });
  ok(e.wo.late === 'strong', 'אימון קשה שנגמר פחות משעה לפני: strong');
  e = exposureFor(D, '23:30', { [Y]: { meals: [], workouts: [{ local_time: '18:00', type: 'cardio', duration_min: 45, rpe: 6 }] } });
  ok(e.wo.late === null && e.wo.ok === true, 'אימון בינוני שנגמר 4.75 שעות לפני: תקין');
  e = exposureFor(D, '23:30', { [Y]: { meals: [], workouts: [{ local_time: '21:00', type: 'walk', duration_min: 30, rpe: 3 }, { local_time: '19:30', type: 'weights', duration_min: 45, rpe: 8 }] } });
  ok(e.wo.late === 'flag' && e.wo.typeHe === 'אימון כוח', 'שני אימונים: הקשה והמאוחר נבחר גם כשהקל נגמר אחריו');
  e = exposureFor(D, '23:30', { [Y]: { meals: [meal('22:30', { kind: 'meal', kcal: 600 })], workouts: [] } });
  ok(e.meal.flag === 'flag' && e.meal.gapH === 1, 'ארוחה שעה לפני שינה: דגל (פחות מ-3 שעות)');
  e = exposureFor(D, '23:30', { [Y]: { meals: [meal('20:00', { kind: 'meal', kcal: 600 })], workouts: [] } });
  ok(e.meal.flag === 'soft', 'ארוחה 3.5 שעות לפני: soft');
  e = exposureFor(D, '00:30', { [Y]: { meals: [meal('22:00', { kind: 'meal', kcal: 500 })], workouts: [] }, [D]: { meals: [meal('00:10', { caffeine_mg: 80 })], workouts: [] } });
  ok(e.caf && e.caf.lastTime === '00:10' && e.caf.lastGapH === 0.3 && e.meal.gapH === 2.5, 'הירדמות אחרי חצות: אירועים של אחרי חצות נספרים', JSON.stringify([e.caf, e.meal]));
  e = exposureFor(D, '23:30', {});
  ok(e.logged === false && e.caf === null && e.alc === null, 'יומן ריק: לא מסיקים שאין קפה ואלכוהול');
  ok(cutoffTime('23:15') === '14:00' && cutoffTime('23:30') === '14:30' && cutoffTime('00:30') === '15:30', 'שעת קפה אחרון: 9 שעות לפני ההירדמות, מעוגלת לחצי שעה');
  ok(midSleep('23:00', '07:00') === 27 * 60 && bedAbs('00:20') === 24 * 60 + 20, 'ציר זמן רציף: אמצע שינה והירדמות אחרי חצות');
}

/* ---------- 2. בדיקת ניסוח: כל גרסה של כל כרטיס ---------- */
const SAMPLE = {
  'look:caf_high': { time: '17:10', mg: 200, gap: 6.3 }, 'look:caf_soft': { time: '16:00', gap: 7.5, cut: '14:00' }, 'look:caf_total': { mg: 480 },
  'look:alcohol': { n: 2, gap: 3.2, rhr: 58, rhrBase: 54.5, hrv: 33, hrvBase: 40 }, 'look:late_workout': { type: 'אימון כוח', rpe: 8, end: '20:55', gap: 2.5 },
  'look:workout_ok': { type: 'אימון אירובי', end: '17:40', gap: 5.8 }, 'look:meal_late': { last: '22:30', gap: 1 }, 'look:meal_soft': { last: '20:00', gap: 3.5 },
  'look:bed_late': { bed: '00:20', median: '23:15', diff: 65 }, 'look:wake_shift': { wake: '08:05', median: '06:30', diff: 95, later: true },
  'look:hrv_dip': { hrv: 31, base: 40, pct: 22, expl: 'אלכוהול, אימון כוח שנגמר ב-20:55' }, 'look:rhr_up': { rhr: 60, base: 54.5, diff: 5.5, expl: '' },
  'look:good_night': { reasons: ['קפה אחרון ב-13:10', 'בלי אלכוהול', 'ארוחה אחרונה 4 שעות לפני השינה'], asleep: 7.4, bed: '23:10', wake: '06:40' },
  'look:no_explainer_poor': { asleep: 5.8, avg7: 6.9 }, 'look:no_log': {}, 'disc:collecting': { n: 3 },
  'disc:social_jetlag': { diff: 95, later: true }, 'disc:bed_vs_usual': { usual: '23:00', median: '00:10' },
  'disc:alcohol_signal': { nA: 4, nN: 18, rhrDiff: 2.8, hrvDiff: 5 }, 'disc:caffeine_signal': { nLate: 7, nOther: 15, diffMin: 31 }, 'disc:workout_signal': { nLate: 4, nOther: 16, rhrDiff: 2.4 },
  'disc:hrv_trend': { up: false, pct: 12, mean7: 35, mean28: 40 }, 'disc:rhr_trend': { up: true, diff: 2.6, mean7: 57, mean28: 54.4 }, 'disc:streak': { n: 5, median: '06:30' },
};
const BANDS = { 'disc:regularity': [['green', { sdBed: 18, sdWake: 12, band: 'green' }], ['amber', { sdBed: 44, sdWake: 30, band: 'amber' }], ['red', { sdBed: 75, sdWake: 66, band: 'red' }]],
  'disc:duration': [['ok', { avg7: 7.3, avg14: 7.1, band: 'ok' }], ['near', { avg7: 6.8, avg14: 6.9, band: 'near' }], ['low', { avg7: 6.2, avg14: 6.3, band: 'low' }]] };
const MOVE_PARAMS = { 'move:fixed_wake': { target: '06:30' }, 'move:coffee_cutoff': { cut: '14:00' }, 'move:earlier_bed': { target: '22:45' } };
const HEB = /[֐-׿]/;
const DASH = /[—–]/;
const BAD = /undefined|NaN|null|\[object|\{|\}|\$\{/;
{
  const texts = [];
  for (const [k, p] of Object.entries(SAMPLE)) for (let v = 0; v < variantCount(k, p); v++) texts.push([`${k}#${v}`, render(k, p, v)]);
  for (const [k, list] of Object.entries(BANDS)) for (const [b, p] of list) for (let v = 0; v < variantCount(k, p); v++) texts.push([`${k}/${b}#${v}`, render(k, p, v)]);
  for (let v = 0; v < variantCount('quiet:stable'); v++) texts.push([`quiet#${v}`, render('quiet:stable', {}, v)]);
  for (const k of Object.keys(FOCUS_NAME)) for (let d = 1; d <= 7; d++) texts.push([`${k} day${d}`, renderMove(k, MOVE_PARAMS[k] || {}, d)]);
  const badOnes = texts.filter(([, t]) => !t || !t.title || !t.body || BAD.test(t.title + t.body) || DASH.test(t.title + t.body) || !HEB.test(t.body) || t.title.length > 60 || t.body.length > 460);
  ok(texts.length >= 120 && badOnes.length === 0, `ניסוח: ${texts.length} גרסאות, בלי undefined, מקף ארוך, סוגריים פתוחים או אורך חריג`, badOnes.map(([n, t]) => `${n}: ${t && (t.title + ' | ' + t.body).slice(0, 120)}`).join('\n'));
  const meds = texts.filter(([, t]) => /להפסיק|לדלג|מינון של התרופה|לשנות מינון|סטטין|תרופה|תרופות|מלטונין|תוסף/.test(t.title + t.body));
  ok(meds.length === 0, 'ניסוח: כרטיסי מבט אחורה, תגליות ומיקוד לא מזכירים תרופות, תוספים או שינוי טיפול', meds.map(([n]) => n).join(','));
  const diag = texts.filter(([, t]) => /יש לך (סוכרת|דום|נדודי|אפניאה)|אתה חולה|את חולה|אבחנה/.test(t.title + t.body));
  ok(diag.length === 0, 'ניסוח: אין אבחנות', diag.map(([n]) => n).join(','));
  const days = texts.filter(([n]) => / day[1-7]$/.test(n));
  const perKey = {};
  for (const [n, t] of days) (perKey[n.split(' ')[0]] ||= new Set()).add(t.title + t.body);
  ok(Object.values(perKey).every((s) => s.size === 7), 'מיקוד: שבעה ימים, שבעה נוסחים שונים לכל מיקוד');
  const perKeyCount = Object.keys(SAMPLE).map((k) => [k, variantCount(k, SAMPLE[k])]);
  ok(perKeyCount.every(([, n]) => n >= 2), 'לכל מפתח לפחות שתי גרסאות', perKeyCount.filter(([, n]) => n < 2).map(([k]) => k).join(','));
}

/* ---------- 3. כל מזהה נושא שהקוד מצטט קיים בספרייה המתוכננת ---------- */
{
  const used = new Set();
  const feed = (arr) => arr.forEach((c) => (c.topics || []).forEach((t) => used.add(t)));
  const w = world({ seed: 3, days: 60, start: '2026-06-01' });
  for (let k = 0; k < 60; k++) {
    const D = addDays('2026-06-01', k), nights = nightsUpTo(w, D), per = analyzeNights(nights, w.logs, '23:15');
    const exp = exposureFor(D, nights[0].bed, w.logs);
    feed(lookCandidates({ night: nights[0], exp, base: baselines(nights), avg7: 400 })); feed(discCandidates({ nights, per, profile: { usual_bed: '23:00' } })); feed(moveCandidates({ nights, per, profile: {} }));
  }
  for (const t of Object.values(THEMES).flat()) used.add(t);
  const missing = [...used].filter((t) => !IDS.includes(t));
  ok(used.size >= 15 && missing.length === 0, `מזהי נושאים בקוד (${used.size}) כולם קיימים ברשימת הספרייה`, missing.join(','));
}

/* ---------- 4. הרכבת יום בסיסית ---------- */
const PROFILE = { usual_bed: '23:15', usual_wake: '06:30' };
{
  const D = '2026-09-29', Y = '2026-09-28';
  const nights = [{ date: D, bed: '23:40', wake: '06:45', asleep_min: 380, in_period_min: 425, hrv_ms: 36, rhr_bpm: 55, efficiency_pct: 88 }];
  const logs = { [Y]: { meals: [meal('17:10', { name: 'פרה-וורקאוט', caffeine_mg: 200 }), meal('20:30', { alcohol_g: 14 })], workouts: [] } };
  const r = composeDay({ date: D, nights, logs, profile: PROFILE, history: [], library: LIB });
  const lanes = r.cards.map((c) => c.lane);
  ok(r.hasSleep && lanes[0] === 'look' && lanes.includes('research') && lanes.includes('move') && lanes.length >= 3, 'יום עם לילה ויומן: מבט אחורה, מחקר, צעד קטן (ותגלית)', lanes.join());
  ok(r.cards[0].key === 'look:alcohol' && r.cards[0].topics.includes('alcohol_sleep_hrv'), 'אלכוהול מדורג לפני קפאין (0.85 מול 0.8), עם נושא "למה ככה?"', r.cards[0].key);
  ok(r.cards.every((c) => c.id === `${D}:${c.lane}` && c.title && c.body && c.emoji && c.label), 'לכל כרטיס מזהה, כותרת, גוף ותווית');
  ok(JSON.stringify(composeDay({ date: D, nights, logs, profile: PROFILE, history: [], library: LIB })) === JSON.stringify(r), 'דטרמיניסטי: אותם נתונים ואותה היסטוריה נותנים אותם כרטיסים');
  const noLib = composeDay({ date: D, nights, logs, profile: PROFILE, history: [], library: [] });
  ok(noLib.cards.length >= 2 && noLib.cards.every((c) => c.lane !== 'research' && c.topics.length === 0), 'בלי ספרייה: אין מחקר היום ואין כפתור "למה ככה?", והשאר עובד');
  const none = composeDay({ date: D, nights: [], logs: {}, profile: {}, history: [], library: LIB });
  ok(none.hasSleep === false && none.cards.some((c) => c.lane === 'research') && none.cards.some((c) => c.lane === 'move'), 'יום ראשון בלי נתונים בכלל: מחקר וצעד קטן, בלי קריסה');
  const logged = composeDay({ date: D, nights: [], logs, profile: PROFILE, history: [], library: LIB });
  ok(logged.notes.basis === 'logged' && logged.cards[0].lane === 'look', 'לפני שהשעון סונכרן: מבט אחורה לפי היומן ושעת השינה הרגילה');
  const first = composeDay({ date: D, nights, logs: {}, profile: PROFILE, history: [], library: LIB });
  ok(first.cards.some((c) => c.key === 'look:no_log' || c.lane === 'disc'), 'לילה בלי יומן: מציעים לרשום, ותגלית "בונים בסיס אישי"');
  ok(first.cards.find((c) => c.lane === 'disc').key === 'disc:collecting', 'פחות מ-5 לילות: כרטיס "בונים בסיס אישי"');
}

/* ---------- 5. סימולציה של 60 יום ---------- */
function simulate({ seed = 11, days = 60, start = '2026-06-01', events = true, feedback = true, profile = PROFILE, lib = LIB, worldOpts = {} } = {}) {
  const w = world({ seed, days, start, events, ...worldOpts });
  const fr = rng(seed + 100);
  const history = [], out = [];
  for (let k = 0; k < days; k++) {
    const D = addDays(start, k);
    const nights = nightsUpTo(w, D);
    const r = composeDay({ date: D, nights, logs: w.logs, profile, history, library: lib });
    for (const c of r.cards) {
      if (feedback && c.lane !== 'weekly') {
        // צעד קטן מוצג כל יום במשך שבוע, ולכן קצב המשוב עליו נמוך בהרבה, אחרת כל המיקודים היו נחסמים תוך שבועות
        const x = fr(), mv = c.lane === 'move';
        c.feedback = x < (mv ? 0.02 : 0.09) ? 'known' : x < (mv ? 0.03 : 0.14) ? 'irrelevant' : !mv && x < 0.24 ? 'more' : undefined;
        if (!c.feedback) delete c.feedback;
      }
      history.push(c);
    }
    out.push({ D, ...r });
  }
  return { w, history, out };
}
{
  const { history, out } = simulate({});
  const sleepDays = out.filter((d) => d.hasSleep);
  ok(out.every((d) => d.cards.length >= 2 && d.cards.length <= 5) && sleepDays.filter((d) => d.cards.length >= 3).length / sleepDays.length >= 0.9, `סימולציה: בכל יום 2 עד 5 כרטיסים, ובלפחות 90% מהימים עם לילה לפחות 3 (${sleepDays.filter((d) => d.cards.length >= 3).length}/${sleepDays.length})`,
    out.filter((d) => d.cards.length < 3 || d.cards.length > 5).map((d) => `${d.D}:${d.cards.map((c) => c.lane).join('+')}`).join(' '));
  const texts = history.filter((c) => c.lane !== 'weekly');
  const byDay = {};
  for (const c of texts) (byDay[c.date] ||= []).push(c.title + '|' + c.body);
  let repeatsWithin14 = 0, consecutiveSame = 0;
  const seen = new Map(), repeatInfo = [];
  for (const c of texts) {
    const key = c.title + '|' + c.body;
    if (seen.has(key)) { const gap = daysBetween(seen.get(key), c.date); if (gap <= 14) { repeatsWithin14++; repeatInfo.push(`${c.key}@${c.date}(gap ${gap})`); } if (gap === 1) consecutiveSame++; }
    seen.set(key, c.date);
  }
  ok(repeatsWithin14 === 0 && consecutiveSame === 0, `סימולציה: אף נוסח לא חוזר באותן מילים תוך 14 יום (${texts.length} כרטיסים)`, repeatInfo.join(' '));
  const moveDays = history.filter((c) => c.lane === 'move');
  let moveRepeat = 0;
  for (let i = 1; i < moveDays.length; i++) if (moveDays[i].title === moveDays[i - 1].title && moveDays[i].body === moveDays[i - 1].body) moveRepeat++;
  ok(moveRepeat === 0, 'סימולציה: כרטיס הצעד הקטן לא חוזר על עצמו מיום ליום');

  const res = history.filter((c) => c.lane === 'research');
  const topicSet = new Set(res.map((c) => c.topics[0]));
  ok(res.length >= 55 && topicSet.size >= 30, `סימולציה: מחקר היום בכל יום (${res.length}), ${topicSet.size} נושאים שונים ב-60 יום`);
  let cooldownBreaks = 0;
  const lastShown = {};
  for (const c of res) { const t = c.topics[0]; if (lastShown[t] && daysBetween(lastShown[t], c.date) < 21) cooldownBreaks++; lastShown[t] = c.date; }
  ok(cooldownBreaks === 0, 'סימולציה: אותו נושא מחקר לא חוזר תוך 21 יום');
  const sens = ['statin_and_sleep', 'statin_muscle_symptoms', 'statin_and_blood_sugar', 'statin_food_interactions', 'melatonin_facts', 'magnesium_supplements_sleep', 'sleep_apnea_signs_men', 'nocturia_prostate_sleep', 'labs_annual_recheck_prediabetes', 'ferritin_and_restless_legs'];
  const sensCards = res.filter((c) => sens.includes(c.topics[0]));
  let sensBreak = 0;
  for (let i = 1; i < sensCards.length; i++) if (daysBetween(sensCards[i - 1].date, sensCards[i].date) < 7) sensBreak++;
  ok(sensBreak === 0 && sensCards.length <= 9, `סימולציה: נושאים רפואיים או רגישים לא יותר מאחד בשבוע (${sensCards.length} ב-60 יום)`);
  const PULL = ['statin_muscle_symptoms', 'statin_food_interactions', 'melatonin_facts', 'magnesium_supplements_sleep'];
  ok(res.every((c) => !PULL.includes(c.topics[0])), 'סימולציה: נושאי תרופות ותוספים (תופעות לוואי, אינטראקציות, מלטונין, מגנזיום) לא מוצגים כ"מחקר היום"');
  const hookPairs = res.map((c) => c.topics[0] + '#' + c.variant);
  ok(new Set(hookPairs).size === hookPairs.length, 'סימולציה: אף ווו מחקר לא חוזר באותו נושא ב-60 יום');

  const dataDays = out.filter((d) => d.cards.some((c) => c.lane === 'look' || c.lane === 'disc'));
  ok(dataDays.length / out.length >= 0.75, `סימולציה: כרטיס מבוסס נתונים אישיים ב-${Math.round((dataDays.length / out.length) * 100)}% מהימים`);

  // פיזור על פני מפתחות ולא רק אלכוהול וקפה
  const keys = new Set(history.filter((c) => c.lane === 'look' || c.lane === 'disc').map((c) => c.key));
  ok(keys.size >= 8, `סימולציה: ${keys.size} סוגי תובנות שונים מבוססי נתונים ב-60 יום`, [...keys].join());

  // משוב: מה שסומן "לא רלוונטי" או "כבר ידעתי" לא חוזר בתקופת החסימה
  let fbBreaks = 0;
  const fbInfo = [];
  for (const c of history.filter((x) => x.feedback === 'known' || x.feedback === 'irrelevant')) {
    const days = c.feedback === 'irrelevant' ? 120 : c.lane === 'research' ? 90 : 60;
    const again = history.filter((x) => x.key === c.key && x.date > c.date && daysBetween(c.date, x.date) < days);
    fbBreaks += again.length;
    again.forEach((x) => fbInfo.push(`${c.key}[${c.feedback}@${c.date}] again@${x.date}`));
    if (c.lane === 'research') fbBreaks += history.filter((x) => x.lane === 'research' && x.topics[0] === c.topics[0] && x.date > c.date && daysBetween(c.date, x.date) < days).length;
  }
  ok(fbBreaks === 0, 'סימולציה: כרטיס שסומן "כבר ידעתי" או "לא רלוונטי" לא חוזר בתקופת החסימה', fbInfo.slice(0, 6).join(' | '));

  // מיקוד: נשאר עד 7 ימים, ואחר כך מתחלף. אותו מיקוד לא חוזר תוך 21 יום
  const runs = [];
  for (const c of moveDays) { const last = runs[runs.length - 1]; if (last && last.key === c.key && daysBetween(last.end, c.date) <= 3) last.end = c.date; else runs.push({ key: c.key, start: c.date, end: c.date }); }
  const longRun = runs.filter((r) => daysBetween(r.start, r.end) + 1 > 7);
  let refocus = 0;
  for (let i = 0; i < runs.length; i++) for (let j = 0; j < i; j++) if (runs[i].key === runs[j].key && daysBetween(runs[j].end, runs[i].start) < 21 && !history.some((c) => c.lane === 'move' && c.key === runs[j].key && c.feedback)) refocus++;
  ok(longRun.length === 0 && runs.length >= 4, `סימולציה: מיקוד נמשך עד 7 ימים ואז מתחלף (${runs.length} מיקודים, ${runs.map((r) => r.key.replace('move:', '')).join(' > ')})`, JSON.stringify(longRun));
  ok(refocus === 0, 'סימולציה: אותו מיקוד לא חוזר תוך 21 יום (אלא אחרי משוב)');

  // סיכום שבוע בשישי בלבד (או בשבת אם החמיצו)
  const wk = history.filter((c) => c.lane === 'weekly');
  ok(wk.length >= 7 && wk.every((c) => weekday(c.date) === 5 || weekday(c.date) === 6), `סימולציה: סיכום שבוע רק בשישי או שבת (${wk.length} סיכומים)`);
  ok(wk.every((c) => c.data && c.data.rows.length >= 3 && c.data.rows.every((r) => r.label && r.value)), 'סימולציה: לסיכום שבוע יש שורות תקינות');
  ok(wk.filter((c) => weekday(c.date) === 6).length <= 1, 'סימולציה: סיכום שבוע לא נוצר פעמיים באותו שבוע');

  // בטיחות: כל טקסט שנוצר נקי
  const allText = history.map((c) => c.title + ' ' + c.body).join('\n');
  ok(!DASH.test(allText) && !BAD.test(allText) && !/להפסיק|סטטין|תרופה/.test(allText), 'סימולציה: כל הטקסטים נקיים ממקף ארוך, שאריות תבנית ואזכור תרופות');
  ok(history.every((c) => c.topics.every((t) => IDS.includes(t))), 'סימולציה: כל נושא בכרטיס קיים בספרייה');
}

/* ---------- 6. תרחיש נקי: אין בעיות, ולכן אין המצאות ---------- */
{
  const { history, out } = simulate({ seed: 5, days: 30, events: false, feedback: false, worldOpts: { clean: true } });
  const flags = history.filter((c) => c.lane === 'look' && !['look:good_night', 'look:workout_ok', 'look:no_log', 'look:hrv_dip', 'look:rhr_up'].includes(c.key));
  ok(flags.length === 0, `תרחיש נקי: אפס אזהרות מומצאות על קפה, אלכוהול, אימון, ארוחה או שעות ב-30 יום (נמצאו ${flags.length})`, flags.map((c) => c.key).join());
  ok(history.filter((c) => c.key === 'look:hrv_dip' || c.key === 'look:rhr_up').length <= 1, 'תרחיש נקי: רעש טבעי של HRV ודופק כמעט לא יוצר כרטיסים');
  ok(out.slice(5).every((d) => d.cards.some((c) => c.lane === 'research') && d.cards.some((c) => c.lane === 'move')), 'תרחיש נקי: כל יום עדיין יש מחקר וצעד קטן');
  const q = history.filter((c) => c.lane === 'quiet');
  const dataDays = out.filter((d) => d.cards.some((c) => c.lane === 'look' || c.lane === 'disc'));
  ok(q.length + dataDays.length >= out.length - 8, `תרחיש נקי: כל יום עם לילה מקבל תובנה אישית או "יום שקט" כנה (${q.length} ימים שקטים, ${dataDays.length} עם נתונים)`);
  ok(q.every((c) => /אין|לא|בלי|שום|יציב|רגיל|חדש|חריג/.test(c.body)), 'תרחיש נקי: ניסוח "יום שקט" כן ולא מציע בעיה');
}

/* ---------- 7. אותות אישיים ---------- */
{
  const start = '2026-06-01';
  const { history } = simulate({ seed: 21, days: 60, start, feedback: false, worldOpts: { alcoholP: [0.25, 0.55] } });
  const sig = history.filter((c) => c.key.startsWith('disc:') && /signal|jetlag|regularity|duration|trend|streak/.test(c.key));
  ok(sig.some((c) => c.key === 'disc:regularity') && sig.some((c) => c.key === 'disc:social_jetlag'), 'תגליות: סדירות וג׳ט לג חברתי מזוהים בעולם עם סוף שבוע מאוחר', [...new Set(sig.map((c) => c.key))].join());
  ok(sig.some((c) => c.key === 'disc:alcohol_signal'), 'תגליות: אות האלכוהול מזוהה כשדופק המנוחה גבוה אחרי שתייה', [...new Set(sig.map((c) => c.key))].join());
}

/* ---------- 8. משוב משנה התנהגות ---------- */
{
  const D = '2026-09-29', Y = '2026-09-28';
  const nights = [{ date: D, bed: '23:40', wake: '06:45', asleep_min: 400, in_period_min: 440, hrv_ms: 36, rhr_bpm: 55, efficiency_pct: 88 }];
  const logs = { [Y]: { meals: [meal('17:10', { caffeine_mg: 200 })], workouts: [] } };
  const a = composeDay({ date: D, nights, logs, profile: PROFILE, history: [], library: LIB });
  const key = a.cards[0].key;
  const D2 = addDays(D, 3);
  const nights2 = [{ ...nights[0], date: D2 }];
  const logs2 = { [addDays(D2, -1)]: logs[Y] };
  const withFb = composeDay({ date: D2, nights: nights2, logs: logs2, profile: PROFILE, history: [{ ...a.cards[0], feedback: 'irrelevant' }], library: LIB });
  const noFb = composeDay({ date: D2, nights: nights2, logs: logs2, profile: PROFILE, history: [a.cards[0]], library: LIB });
  ok(noFb.cards.some((c) => c.key === key) && !withFb.cards.some((c) => c.key === key), '"לא רלוונטי" מסתיר את הכרטיס, וללא משוב הוא חוזר אחרי תקופת הצינון');
  const inCool = composeDay({ date: addDays(D, 1), nights: [{ ...nights[0], date: addDays(D, 1) }], logs: { [D]: logs[Y] }, profile: PROFILE, history: [a.cards[0]], library: LIB });
  ok(!inCool.cards.some((c) => c.key === key), 'צינון: אותו מפתח לא מופיע יומיים ברציפות');
  const resKey = a.cards.find((c) => c.lane === 'research');
  const known = composeDay({ date: addDays(D, 25), nights: [], logs: {}, profile: PROFILE, history: [{ ...resKey, feedback: 'known' }], library: LIB });
  ok(!known.cards.some((c) => c.lane === 'research' && c.topics[0] === resKey.topics[0]), '"כבר ידעתי" על מחקר מסתיר את הנושא גם אחרי 25 יום');
  const more = composeDay({ date: addDays(D, 25), nights: [], logs: {}, profile: PROFILE, history: [{ ...resKey, feedback: 'more' }], library: LIB });
  ok(!!more.cards.find((c) => c.lane === 'research'), '"עוד כאלה" לא שובר את הרכבת היום');
}

/* ---------- 9. שינוי שעון: ההרכבה עובדת גם סביב מעבר לשעון חורף ---------- */
{
  const w = world({ seed: 9, days: 30, start: '2026-10-10' });
  const bad = [];
  for (let k = 0; k < 30; k++) { const D = addDays('2026-10-10', k); const r = composeDay({ date: D, nights: nightsUpTo(w, D), logs: w.logs, profile: PROFILE, history: [], library: LIB }); if (!r.cards.length) bad.push(D); }
  ok(bad.length === 0, 'הרכבה בלי היסטוריה סביב 25.10.2026 לא קורסת ולא מחזירה יום ריק');
}

/* ---------- 10. פרופיל שני (ליאור): בלי טרום סוכרת ---------- */
{
  const { PERSONAS, topicAllowed } = await import('../src/persona.js');
  const { coachRules } = await import('../src/coach.js');
  const P = PERSONAS.lior;
  const lib = LIB.filter(topicAllowed(P));
  ok(!lib.some((t) => t.id === 'prediabetes_sleep_glucose' || t.id === 'labs_annual_recheck_prediabetes') && lib.length === LIB.filter((t) => !['prediabetes_sleep_glucose', 'labs_annual_recheck_prediabetes'].includes(t.id)).length,
    'ליאור: נושאי טרום סוכרת לא נדחפים, ושאר הספרייה זמינה');
  ok(LIB.filter(topicAllowed(PERSONAS.friend)).length === LIB.length, 'החבר: כל הספרייה זמינה כמו קודם');
  const w = world({ seed: 21, days: 60, start: '2026-08-01' });
  const H = []; const leaks = []; const gated = [];
  for (let k = 0; k < 60; k++) {
    const D = addDays('2026-08-01', k);
    const r = composeDay({ date: D, nights: nightsUpTo(w, D), logs: w.logs, profile: PROFILE, history: H, library: lib, glucoseCtx: P.glucoseCtx });
    for (const c of r.cards) {
      H.push({ ...c, feedback: null });
      if (c.lane !== 'research' && /טרום סוכרת/.test(c.title + c.body)) leaks.push(`${D} ${c.key}`);
      if (c.topics.some((t) => t === 'prediabetes_sleep_glucose' || t === 'labs_annual_recheck_prediabetes')) gated.push(`${D} ${c.key}`);
    }
  }
  ok(leaks.length === 0, 'ליאור, 60 יום: אף כרטיס שלנו לא אומר "טרום סוכרת"', leaks.join(', '));
  ok(gated.length === 0, 'ליאור, 60 יום: אף כרטיס לא מפנה לנושא של טרום סוכרת', gated.join(', '));
  const rules = coachRules(P);
  ok(!/טרום סוכרת/.test(rules.replace('בלי טרום סוכרת', '')) && rules.includes('99') && rules.includes('הסטטין אינו הסבר'), 'ליאור: ההנחיה למאמן בלי טרום סוכרת, עם הסוכר הגבולי ועם כללי הסטטין');
}

console.log(`\nסיכום: ${pass} עברו, ${fail} נכשלו`);
process.exit(fail ? 1 : 0);
