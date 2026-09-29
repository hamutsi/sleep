// פענוח תשובות Google Health לשורות במסד, וכלי אבחון שמסתיר ערכים.
// שמות השדות לפי developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints.
// המסמכים סותרים במקומות (ראה research/raw/A_google-health-api_v1.md סעיף 3.6), ולכן הפענוח סלחני ונשמר JSON גולמי.
import { localDate, ymd, durSeconds, num, int, camel } from '../util.js';

export const SLEEP_COLS = [
  'id', 'night_date', 'start_utc', 'end_utc', 'start_offset_s', 'end_offset_s', 'sleep_type', 'is_main', 'is_nap', 'processed',
  'stages_status', 'manually_edited', 'min_in_period', 'min_asleep', 'min_awake', 'min_to_fall_asleep', 'min_after_wake',
  'deep_min', 'light_min', 'rem_min', 'awake_min', 'awake_count', 'efficiency_pct', 'device', 'update_time', 'stages_json', 'raw_json', 'synced_at',
];

export function parseSleep(dp, syncedAt) {
  const s = dp && dp.sleep;
  const iv = s && s.interval;
  const id = dp && (dp.name || dp.dataPointName);
  if (!id || !iv || !iv.startTime || !iv.endTime) return null;
  const sum = s.summary || {};
  const md = s.metadata || {};
  const by = {};
  for (const x of sum.stagesSummary || []) by[x.type] = x;
  const asleep = int(sum.minutesAsleep);
  const inPeriod = int(sum.minutesInSleepPeriod);
  const flag = (v) => (v == null ? null : v ? 1 : 0);
  return {
    id,
    night_date: ymd(iv.civilEndTime && iv.civilEndTime.date) || localDate(new Date(iv.endTime)),
    start_utc: iv.startTime,
    end_utc: iv.endTime,
    start_offset_s: durSeconds(iv.startUtcOffset),
    end_offset_s: durSeconds(iv.endUtcOffset),
    sleep_type: s.type || null,
    is_main: flag(md.main),
    is_nap: md.nap ? 1 : 0,
    processed: flag(md.processed),
    stages_status: md.stagesStatus || null,
    manually_edited: md.manuallyEdited ? 1 : 0,
    min_in_period: inPeriod,
    min_asleep: asleep,
    min_awake: int(sum.minutesAwake),
    min_to_fall_asleep: int(sum.minutesToFallAsleep),
    min_after_wake: int(sum.minutesAfterWakeUp),
    deep_min: int(by.DEEP && by.DEEP.minutes),
    light_min: int(by.LIGHT && by.LIGHT.minutes),
    rem_min: int(by.REM && by.REM.minutes),
    awake_min: int(by.AWAKE && by.AWAKE.minutes),
    awake_count: int(by.AWAKE && by.AWAKE.count),
    efficiency_pct: inPeriod > 0 && asleep != null ? Math.round((asleep / inPeriod) * 100) : null,
    device: (dp.dataSource && dp.dataSource.device && dp.dataSource.device.displayName) || null,
    update_time: s.updateTime || null,
    stages_json: JSON.stringify((s.stages || []).map((x) => ({ t: x.type, s: x.startTime, e: x.endTime }))),
    raw_json: JSON.stringify(dp),
    synced_at: syncedAt,
  };
}

// עמודות של daily_recovery לפי סוג נתון
const DAILY = {
  'daily-heart-rate-variability': (x) => ({
    hrv_rmssd_ms: num(x.averageHeartRateVariabilityMilliseconds),
    hrv_deep_rmssd_ms: num(x.deepSleepRootMeanSquareOfSuccessiveDifferencesMilliseconds),
    nonrem_hr_bpm: num(x.nonRemHeartRateBeatsPerMinute),
  }),
  'daily-resting-heart-rate': (x) => ({ rhr_bpm: num(x.beatsPerMinute) }),
  'daily-oxygen-saturation': (x) => ({ spo2_avg: num(x.averagePercentage), spo2_low: num(x.lowerBoundPercentage), spo2_high: num(x.upperBoundPercentage) }),
  'daily-respiratory-rate': (x) => ({ br_bpm: num(x.breathsPerMinute) }),
  'daily-sleep-temperature-derivations': (x) => ({
    skin_nightly_c: num(x.nightlyTemperatureCelsius),
    skin_baseline_c: num(x.baselineTemperatureCelsius),
    skin_sd30_c: num(x.relativeNightlyStddev30dCelsius),
  }),
};
export const DAILY_TYPES = Object.keys(DAILY);
export const DAILY_COLS = ['hrv_rmssd_ms', 'hrv_deep_rmssd_ms', 'nonrem_hr_bpm', 'rhr_bpm', 'spo2_avg', 'spo2_low', 'spo2_high', 'br_bpm', 'skin_nightly_c', 'skin_baseline_c', 'skin_sd30_c'];

export function parseDaily(type, dp) {
  const x = dp && dp[camel(type)];
  const date = ymd(x && x.date);
  if (!date || !DAILY[type]) return null;
  return { date, cols: DAILY[type](x), raw: dp };
}

// מבנה בלי ערכים: אפשר להדביק בצ'אט כדי לבדוק פענוח בלי לחשוף נתונים אישיים.
// מספרים ומחרוזות הופכים לסוג שלהם, מחרוזות בפורמט enum נשארות (AWAKE, STAGES), מערכים מקוצרים לאיבר אחד.
export function maskShape(v) {
  if (v == null) return v;
  if (Array.isArray(v)) return v.length ? { __array_len: v.length, __first: maskShape(v[0]) } : [];
  if (typeof v === 'number') return Number.isInteger(v) ? '<int>' : '<float>';
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return '<timestamp>';
    if (/^-?\d+$/.test(v)) return '<int64 string>';
    if (/^-?\d+(\.\d+)?s$/.test(v)) return '<duration>';
    if (/^[A-Z][A-Z0-9_]{1,40}$/.test(v)) return v;
    return '<string>';
  }
  if (typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, maskShape(x)]));
  return '<?>';
}
