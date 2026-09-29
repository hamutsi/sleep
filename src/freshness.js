// יום המאמן ושער העדכניות: לפני שמציגים תובנות או פותחים שיחה, מסנכרנים מהשעון ובודקים אם נתוני הלילה הגיעו.
import { localDate, now, TZ } from './util.js';
import { syncRecent } from './gh/sync.js';
import { getConn } from './gh/oauth.js';
import { nightsSummary } from './data.js';

export const DAY_START_HOUR = 4;   // יום המאמן מתחיל ב-04:00 בשעון ישראל, כדי ששיחה של אחרי חצות שייכת ליום הקודם
export const coachDate = (d = new Date()) => localDate(new Date(d.getTime() - DAY_START_HOUR * 3600 * 1000));

const localHour = (env) => (env.COACH_FORCE_HOUR != null && env.COACH_FORCE_HOUR !== '' ? Number(env.COACH_FORCE_HOUR)
  : Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(new Date())));

// הנתונים מגיעים ל-API רק אחרי שהטלפון סנכרן את השעון, ולכן האפליקציה לא יכולה לכפות סנכרון. היא בודקת, מנסה, ואומרת בכנות מה המצב.
export async function freshnessGate(env, cdate) {
  const c = await getConn(env);
  const gate = { state: 'ok', ghStatus: (c && c.status) || 'disconnected', synced: false, lastDeviceSync: (c && c.last_device_sync) || null, sleepForToday: false, note: null };
  if (!c || c.status !== 'connected') { gate.state = 'no_connection'; return gate; }
  if (!c.last_sync_at || now() - c.last_sync_at > 300) {
    try { await syncRecent(env, 3); gate.synced = true; }
    catch (e) { gate.state = e.code === 'needs_reauth' ? 'needs_reauth' : 'sync_failed'; gate.note = e.code || 'error'; }
  } else gate.synced = true;
  const c2 = await getConn(env);
  gate.lastDeviceSync = c2.last_device_sync;
  const nights = await nightsSummary(env, 2);   // כולל איחוד קטעי שינה, ולכן הלילה נחשב כשיש קטע אחד לפחות
  const s = nights.length && nights[0].date === cdate;
  gate.sleepForToday = !!s;
  // חתימת הלילה: אם קטע שינה נוסף הגיע אחרי שהתובנות הורכבו (למשל שינה שנייה בבוקר), התובנות מורכבות מחדש
  gate.nightSig = s ? `${nights[0].asleep_min}:${nights[0].wake}` : null;
  if (gate.state === 'ok' && !s) gate.state = localHour(env) < 12 ? 'waiting_for_watch' : 'no_sleep_today';
  return gate;
}
