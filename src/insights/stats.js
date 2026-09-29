// חישובים קטנים ללא תלות בשרת: סטטיסטיקה, שעות על ציר זמן רציף, תאריכים. משמש את מנוע התובנות ואת בדיקות הסימולציה.

export const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
export const median = (a) => {
  if (!a.length) return null;
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
export const sd = (a) => {
  if (a.length < 3) return null;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
};
export const r1 = (x) => (x == null || Number.isNaN(x) ? null : Math.round(x * 10) / 10);
export const nums = (arr) => arr.filter((v) => v != null && Number.isFinite(v));

// שעות: "23:15" -> דקות מחצות. שעת הירדמות אחרי חצות נספרת כהמשך הלילה, כדי ש-23:30 ו-00:20 יהיו קרובות ולא רחוקות
export const mm = (hm) => { const [h, m] = String(hm).split(':').map(Number); return h * 60 + m; };
export const bedAbs = (hm) => { const x = mm(hm); return x < 12 * 60 ? x + 24 * 60 : x; };
export const fmtHM = (min) => {
  const x = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
};
// אמצע השינה על אותו ציר (מחצות של היום שלפני ההשכמה)
export const midSleep = (bedHm, wakeHm) => (bedAbs(bedHm) + 24 * 60 + mm(wakeHm)) / 2;

export const addDays = (ymd, n) => { const [y, m, d] = ymd.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10); };
export const weekday = (ymd) => { const [y, m, d] = ymd.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); };   // 0 = ראשון
export const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

// גיבוב דטרמיניסטי (FNV-1a): בחירה "אקראית" שחוזרת זהה באותו יום, כדי שרענון לא ישנה את הכרטיסים
export function hash32(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}

// מספר לתצוגה: שלם בלי נקודה, אחרת ספרה אחת אחרי הנקודה
export const num = (x) => (x == null ? '' : Number.isInteger(x) ? String(x) : (Math.round(x * 10) / 10).toFixed(1));
