// בדיקות לאיחוד קטעי שינה ללילות. הנתונים הם שורות אמיתיות ממסד הנתונים של החיבור הראשון (שעות מקומיות UTC+3),
// והתוצאה הצפויה היא מה ש-Google Health הציגה באפליקציה: 00:03 עד 08:39, שינה 6h 26m, ערות 2h 10m, REM 1h 27m, קלה 3h 5m, עמוקה 1h 54m.
// הרצה:  node tests/nights.test.mjs
import { clusterNights, nightsByDate, isNightLike } from '../src/gh/nights.js';

let pass = 0, fail = 0;
const ok = (c, m, extra) => { c ? pass++ : fail++; console.log(`${c ? 'PASS' : 'FAIL'} ${m}${!c && extra !== undefined ? '\n     ' + String(extra).slice(0, 400) : ''}`); };

const row = (night_date, start_utc, end_utc, extra) => ({ night_date, start_utc, end_utc, start_offset_s: 10800, end_offset_s: 10800, is_nap: 0, processed: 1, stages_status: 'SUCCEEDED', sleep_type: 'STAGES', device: null, min_to_fall_asleep: 0, ...extra });
const S1 = row('2026-09-28', '2026-09-27T21:29:00Z', '2026-09-28T04:04:00Z', { min_in_period: 395, min_asleep: 390, min_awake: 5, deep_min: 75, light_min: 246, rem_min: 69, awake_min: 5, awake_count: 2 });
const S2 = row('2026-09-29', '2026-09-28T21:03:00Z', '2026-09-29T01:27:00Z', { min_in_period: 264, min_asleep: 258, min_awake: 6, deep_min: 83, light_min: 124, rem_min: 51, awake_min: 6, awake_count: 2 });
const S3 = row('2026-09-29', '2026-09-29T03:14:00Z', '2026-09-29T05:39:00Z', { is_nap: 1, min_in_period: 145, min_asleep: 128, min_awake: 17, deep_min: 31, light_min: 61, rem_min: 36, awake_min: 17, awake_count: 3 });

const nights = nightsByDate([S1, S2, S3]);
ok(nights.length === 2 && nights[0].date === '2026-09-29' && nights[1].date === '2026-09-28', 'שלושה קטעים הופכים לשני לילות (הקטע השני והשלישי מתאחדים)', nights.map((n) => n.date).join());
const n = nights[0];
ok(n.bed === '00:03' && n.wake === '08:39', 'הירדמות 00:03 והשכמה 08:39, כמו ב-Google Health', `${n.bed} ${n.wake}`);
ok(n.asleep_min === 386 && Math.floor(n.asleep_min / 60) === 6 && n.asleep_min % 60 === 26, 'סך שינה 6h 26m', n.asleep_min);
ok(n.in_bed_min === 516 && n.gap_min === 107 && n.awake_min === 130, 'במיטה 8:36, פער 1:47, ערות 2h 10m (כולל הפער)', JSON.stringify([n.in_bed_min, n.gap_min, n.awake_min]));
ok(n.deep_min === 114 && n.light_min === 185 && n.rem_min === 87, 'שלבים: עמוקה 1h 54m, קלה 3h 5m, REM 1h 27m', JSON.stringify([n.deep_min, n.light_min, n.rem_min]));
ok(n.segments.length === 2 && n.segments[0].start === '00:03' && n.segments[1].end === '08:39', 'שני הקטעים נשמרים לתצוגה');
ok(nights[1].asleep_min === 390 && nights[1].segments.length === 1 && nights[1].bed === '00:29' && nights[1].wake === '07:04', 'הלילה הקודם נשאר בודד ולא מתאחד עם הבא (פער של 17 שעות)');

// נמנום של אחר הצהריים לא הופך לחלק מהלילה
const NAP = row('2026-09-29', '2026-09-29T10:00:00Z', '2026-09-29T11:30:00Z', { is_nap: 1, min_in_period: 90, min_asleep: 80, min_awake: 10, deep_min: 10, light_min: 60, rem_min: 10, awake_min: 10, awake_count: 1 });
ok(!isNightLike(NAP) && isNightLike(S2) && isNightLike(S3), 'נמנום ב-13:00 עד 14:30 אינו לילה, וקטעי הלילה כן');
ok(nightsByDate([S1, S2, S3, NAP])[0].asleep_min === 386, 'נמנום של אחר הצהריים לא נספר בתוך הלילה');

// פער גדול מ-3 שעות לא מאחד
const LATE = row('2026-09-29', '2026-09-29T05:00:00Z', '2026-09-29T06:30:00Z', { min_in_period: 90, min_asleep: 85, min_awake: 5, deep_min: 10, light_min: 60, rem_min: 15, awake_min: 5, awake_count: 1 });
const two = clusterNights([S2, LATE]);
ok(two.length === 2, 'פער של יותר מ-3 שעות בין קטעים (04:27 עד 08:00) יוצר שני לילות נפרדים', two.length);
ok(nightsByDate([S2, LATE])[0].asleep_min === 258, 'מבין שני הלילות של אותו תאריך נשאר זה עם הכי הרבה שינה');

// לילה בקטע אחד לא משתנה
const one = nightsByDate([S1])[0];
ok(one.asleep_min === 390 && one.in_bed_min === 395 && one.awake_min === 5 && one.gap_min === 0 && one.efficiency_pct === 99, 'לילה בקטע אחד: אותם מספרים כמו בנתוני גוגל');

// קטע ערב קצר לפני הלילה מתאחד איתו
const DOZE = row('2026-09-28', '2026-09-28T18:30:00Z', '2026-09-28T19:15:00Z', { min_in_period: 45, min_asleep: 40, min_awake: 5, deep_min: 0, light_min: 40, rem_min: 0, awake_min: 5, awake_count: 1 });
const d = nightsByDate([DOZE, S2])[0];
ok(d.date === '2026-09-29' && d.bed === '21:30' && d.segments.length === 2, 'תנומה של ערב (21:30) שהפער ממנה לשינה קטן מ-3 שעות מתאחדת עם הלילה', JSON.stringify([d.date, d.bed, d.segments.length]));

console.log(`\nסיכום: ${pass} עברו, ${fail} נכשלו`);
process.exit(fail ? 1 : 0);
