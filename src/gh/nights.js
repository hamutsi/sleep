// איחוד קטעי שינה ללילות. Google Health מציגה לילה אחד גם כשה-API מחזיר כמה קטעים: למשל 00:03 עד 04:27 כשינה ראשית ו-06:14 עד 08:39 כ"נמנום"
// (nap), עם פער של שעה וארבעים דקות ביניהם. באפליקציה של גוגל זה לילה אחד של 00:03 עד 08:39, שינה 6:26 וערות 2:10 (כולל הפער).
// לכן מאחדים קטעים שהפער ביניהם עד 3 שעות, ושהאמצע שלהם בלילה. נמנום של אחר הצהריים נשאר נפרד ולא נספר כלילה.
import { hhmm } from '../util.js';

export const GAP_MS = 3 * 3600 * 1000;

// שעה מקומית של רגע נתון, לפי ההיסט שגוגל מחזירה יחד עם הרגע
const localMs = (iso, offsetS) => Date.parse(iso) + (offsetS || 0) * 1000;
const localHour = (ms) => { const d = new Date(ms); return d.getUTCHours() + d.getUTCMinutes() / 60; };
const localDay = (iso, offsetS) => new Date(localMs(iso, offsetS)).toISOString().slice(0, 10);

// קטע שהאמצע שלו בין 11:00 ל-20:00 בשעה מקומית הוא נמנום של היום ולא חלק מהלילה
export function isNightLike(r) {
  const mid = (localMs(r.start_utc, r.start_offset_s) + localMs(r.end_utc, r.end_offset_s)) / 2;
  const h = localHour(mid);
  return h < 11 || h >= 20;
}

const sumBy = (parts, k) => parts.reduce((a, x) => a + (Number(x[k]) || 0), 0);

// rows: שורות sleep_session. מחזיר את כל הלילות שנמצאו (כמה לאותו תאריך אם יש), מהישן לחדש
export function clusterNights(rows) {
  const sess = rows.filter(isNightLike).map((r) => ({ ...r, s: Date.parse(r.start_utc), e: Date.parse(r.end_utc) })).sort((a, b) => a.s - b.s);
  const clusters = [];
  for (const r of sess) {
    const c = clusters[clusters.length - 1];
    if (c && r.s - c.end <= GAP_MS) { c.parts.push(r); c.end = Math.max(c.end, r.e); } else clusters.push({ parts: [r], start: r.s, end: r.e });
  }
  return clusters.map((c) => {
    const first = c.parts[0];
    const last = c.parts.reduce((a, b) => (b.e > a.e ? b : a));
    const inBed = Math.round((c.end - c.start) / 60000);
    const inPeriodSum = sumBy(c.parts, 'min_in_period');
    const gap = Math.max(0, inBed - inPeriodSum);
    const asleep = sumBy(c.parts, 'min_asleep');
    return {
      date: localDay(last.end_utc, last.end_offset_s),
      start_utc: first.start_utc, start_offset_s: first.start_offset_s, end_utc: last.end_utc, end_offset_s: last.end_offset_s,
      bed: hhmm(first.start_utc, first.start_offset_s), wake: hhmm(last.end_utc, last.end_offset_s),
      asleep_min: asleep, in_bed_min: inBed, gap_min: gap,
      awake_min: sumBy(c.parts, 'awake_min') + gap,                      // ערות כוללת את הפער בין הקטעים, כמו ב-Google Health
      awake_count: sumBy(c.parts, 'awake_count'),
      deep_min: sumBy(c.parts, 'deep_min'), light_min: sumBy(c.parts, 'light_min'), rem_min: sumBy(c.parts, 'rem_min'),
      min_to_fall_asleep: first.min_to_fall_asleep ?? null,
      efficiency_pct: inBed > 0 ? Math.round((asleep / inBed) * 100) : null,
      processed: c.parts.every((x) => x.processed === 1) ? 1 : 0,
      stages_status: c.parts.every((x) => x.stages_status === 'SUCCEEDED') ? 'SUCCEEDED' : first.stages_status || null,
      sleep_type: first.sleep_type || null, device: first.device || null,
      segments: c.parts.map((x) => ({ start: hhmm(x.start_utc, x.start_offset_s), end: hhmm(x.end_utc, x.end_offset_s), asleep_min: x.min_asleep })),
    };
  });
}

// לכל תאריך השכמה נשאר הלילה עם הכי הרבה שינה. מחזיר מהחדש לישן
export function nightsByDate(rows) {
  const best = new Map();
  for (const n of clusterNights(rows)) { const b = best.get(n.date); if (!b || n.asleep_min > b.asleep_min) best.set(n.date, n); }
  return [...best.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const SESSION_COLS = 'night_date, start_utc, end_utc, start_offset_s, end_offset_s, is_nap, processed, stages_status, sleep_type, device, min_in_period, min_asleep, min_awake, min_to_fall_asleep, deep_min, light_min, rem_min, awake_min, awake_count';
