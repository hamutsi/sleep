// כלים משותפים: קידוד, זמן בשעון ישראל, המרות של שדות מה-API.
export const enc = new TextEncoder();
export const dec = new TextDecoder();

export const b64u = {
  enc: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
};

export const now = () => Math.floor(Date.now() / 1000);
export const randB64u = (bytes = 32) => b64u.enc(crypto.getRandomValues(new Uint8Array(bytes)));

export const TZ = 'Asia/Jerusalem';

// YYYY-MM-DD בשעון ישראל
export function localDate(d = new Date(), tz = TZ) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export function addDays(ymdStr, n) {
  const [y, m, d] = ymdStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

// {year, month, day} של גוגל -> YYYY-MM-DD
export const ymd = (o) => (o && o.year ? `${o.year}-${String(o.month).padStart(2, '0')}-${String(o.day).padStart(2, '0')}` : null);

// "10800s" -> 10800
export const durSeconds = (s) => (typeof s === 'string' ? parseInt(s, 10) || 0 : Number(s) || 0);

// מספרים שמגיעים כמחרוזות int64
export const num = (v) => (v == null || v === '' ? null : Number.isFinite(Number(v)) ? Number(v) : null);
export const int = (v) => (num(v) == null ? null : Math.round(num(v)));

// זמן מקומי HH:MM מתוך ISO ב-UTC והיסט בשניות
export function hhmm(iso, offsetSeconds = 0) {
  if (!iso) return null;
  const t = new Date(new Date(iso).getTime() + offsetSeconds * 1000);
  return `${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}`;
}

// היסט של אזור זמן ביחס ל-UTC באלפיות שנייה, ברגע נתון
function tzOffsetMs(utcMs, tz) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(new Date(utcMs));
  const g = (t) => Number(p.find((x) => x.type === t).value);
  return Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second')) - utcMs;
}

// תאריך ושעה כפי שהמשתמש רואה אותם בשעון ישראל -> שניות epoch (מתחשב במעבר שעון קיץ וחורף)
export function localToEpoch(date, time, tz = TZ) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm);
  let t = wall - tzOffsetMs(wall, tz);
  t = wall - tzOffsetMs(t, tz);   // סבב שני מתקן רגעים סמוך למעבר שעון
  return Math.floor(t / 1000);
}

// UPPER_SNAKE -> camelCase של סוג נתונים: daily-heart-rate-variability -> dailyHeartRateVariability
export const camel = (kebab) => kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
export const snake = (kebab) => kebab.replace(/-/g, '_');
