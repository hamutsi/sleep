// סנכרון מ-Google Health למסד, ושליפת "הלילה האחרון" מהמסד (בלי לפנות לגוגל).
import { now, localDate, addDays, snake } from '../util.js';
import { nightsByDate, SESSION_COLS } from './nights.js';
import { ghGet, listPoints } from './api.js';
import { ensureAccessToken } from './oauth.js';
import { parseSleep, parseDaily, maskShape, SLEEP_COLS, DAILY_TYPES, DAILY_COLS } from './parse.js';
import { errCode } from './errors.js';

const FAMILY = 'users/me/dataSourceFamilies/google-wearables';   // מכשיר הלבישה בלבד, בלי הזנות ידניות והערכות של הטלפון

export async function syncRecent(env, days = 3) {
  const t = now();
  // מרעננים טוקן פעם אחת לפני שמפעילים בקשות מקבילות, כדי לא לרענן תשע פעמים במקביל
  await ensureAccessToken(env);

  const today = localDate();
  const from = addDays(today, -days);
  const to = addDays(today, 1);
  const sleepFilter = `sleep.interval.civil_end_time >= "${from}" AND sleep.interval.civil_end_time < "${to}"`;

  const jobs = {
    sleep: async () => {
      try { return await listPoints(env, 'sleep', { reconcile: true, pageSize: 25, filter: sleepFilter, extra: { dataSourceFamily: FAMILY } }); }
      catch (e) { if (e.status === 400) return listPoints(env, 'sleep', { pageSize: 25, filter: sleepFilter }); throw e; }
    },
    devices: () => ghGet(env, '/users/me/pairedDevices'),
  };
  for (const type of DAILY_TYPES) jobs[type] = () => listPoints(env, type, { pageSize: 30, filter: `${snake(type)}.date >= "${from}"` });

  const names = Object.keys(jobs);
  const settled = await Promise.allSettled(names.map((n) => jobs[n]()));
  const status = {};
  const data = {};
  settled.forEach((r, i) => {
    const n = names[i];
    if (r.status === 'fulfilled') { data[n] = r.value; status[n] = { ok: true, count: Array.isArray(r.value) ? r.value.length : undefined }; }
    else status[n] = { ok: false, error: errCode(r.reason), http: r.reason && r.reason.status, detail: r.reason && r.reason.detail };
  });
  // אם כל הבקשות נכשלו באותה שגיאת הרשאה, מעלים אותה למעלה במקום להסתיר
  const failed = settled.filter((r) => r.status === 'rejected');
  if (failed.length === names.length) throw failed[0].reason;

  const stmts = [];
  const sleepRows = (data.sleep || []).map((dp) => parseSleep(dp, t)).filter(Boolean);
  const sleepSql = `INSERT INTO sleep_session (${SLEEP_COLS.join(', ')}) VALUES (${SLEEP_COLS.map((_, i) => '?' + (i + 1)).join(', ')})
    ON CONFLICT(id) DO UPDATE SET ${SLEEP_COLS.filter((c) => c !== 'id').map((c) => `${c} = excluded.${c}`).join(', ')}`;
  for (const r of sleepRows) stmts.push(env.DB.prepare(sleepSql).bind(...SLEEP_COLS.map((c) => r[c])));

  const byDate = {};
  for (const type of DAILY_TYPES) {
    for (const dp of data[type] || []) {
      const p = parseDaily(type, dp);
      if (!p) continue;
      const e = (byDate[p.date] ||= { cols: {}, raw: {} });
      Object.assign(e.cols, p.cols);
      e.raw[type] = p.raw;
    }
  }
  const n = DAILY_COLS.length;
  const dailySql = `INSERT INTO daily_recovery (date, ${DAILY_COLS.join(', ')}, raw_json, synced_at)
    VALUES (?1, ${DAILY_COLS.map((_, i) => '?' + (i + 2)).join(', ')}, ?${n + 2}, ?${n + 3})
    ON CONFLICT(date) DO UPDATE SET ${DAILY_COLS.map((c) => `${c} = COALESCE(excluded.${c}, ${c})`).join(', ')},
      raw_json = json_patch(COALESCE(raw_json, '{}'), excluded.raw_json), synced_at = excluded.synced_at`;
  for (const [date, e] of Object.entries(byDate)) {
    stmts.push(env.DB.prepare(dailySql).bind(date, ...DAILY_COLS.map((c) => (e.cols[c] === undefined ? null : e.cols[c])), JSON.stringify(e.raw), t));
  }

  // תשובות גולמיות אחרונות לבדיקת מבנה (בשינה רק שתי הראשונות, כי מערך השלבים גדול)
  for (const [kind, body] of Object.entries(data)) {
    const val = kind === 'sleep' ? body.slice(0, 2) : body;
    stmts.push(env.DB.prepare('INSERT INTO gh_raw (kind, body, fetched_at) VALUES (?1, ?2, ?3) ON CONFLICT(kind) DO UPDATE SET body = excluded.body, fetched_at = excluded.fetched_at')
      .bind(kind, JSON.stringify(val), t));
  }

  const dev = ((data.devices && data.devices.pairedDevices) || []).slice().sort((a, b) => String(b.lastSyncTime || '').localeCompare(String(a.lastSyncTime || '')))[0];
  stmts.push(env.DB.prepare('UPDATE gh_connection SET last_sync_at = ?1, last_device_sync = COALESCE(?2, last_device_sync), device_version = COALESCE(?3, device_version) WHERE id = 1')
    .bind(t, (dev && dev.lastSyncTime) || null, (dev && dev.deviceVersion) || null));

  await env.DB.batch(stmts);
  return { ok: true, window: { from, to }, sleepSessions: sleepRows.length, dailyDates: Object.keys(byDate).length, status, lastSyncAt: t };
}

const strip = (r) => { if (!r) return null; const { raw_json, synced_at, ...rest } = r; return rest; };

export async function lastNight(env) {
  const top = await env.DB.prepare('SELECT MAX(night_date) AS d FROM sleep_session').first();
  if (!top || !top.d) return null;
  const rows = ((await env.DB.prepare(`SELECT ${SESSION_COLS} FROM sleep_session WHERE night_date >= ?1`).bind(addDays(top.d, -3)).all()).results) || [];
  const s = nightsByDate(rows)[0];   // קטעי שינה סמוכים מאוחדים ללילה אחד, כמו ב-Google Health
  if (!s) return null;
  const prev = addDays(s.date, -1);
  const rec = await env.DB.prepare('SELECT * FROM daily_recovery WHERE date IN (?1, ?2)').bind(s.date, prev).all();
  const by = Object.fromEntries((rec.results || []).map((r) => [r.date, r]));
  return {
    night_date: s.date,
    bed: s.bed,
    wake: s.wake,
    minutes_asleep: s.asleep_min,
    minutes_in_period: s.in_bed_min,
    minutes_to_fall_asleep: s.min_to_fall_asleep,
    efficiency_pct: s.efficiency_pct,
    stages: { deep: s.deep_min, light: s.light_min, rem: s.rem_min, awake: s.awake_min, awake_count: s.awake_count },
    segments: s.segments,
    gap_min: s.gap_min,
    processed: s.processed,
    stages_status: s.stages_status,
    sleep_type: s.sleep_type,
    device: s.device,
    // כאן גם רואים אם התאריך של הרשומות היומיות הוא יום ההשכמה או הערב שלפני. בודקים בלילה האמיתי הראשון.
    recovery: { same_day: strip(by[s.date]), previous_day: strip(by[prev]) },
  };
}

export async function shapeOf(env) {
  const rows = await env.DB.prepare('SELECT kind, body, fetched_at FROM gh_raw ORDER BY kind').all();
  const out = {};
  for (const r of rows.results || []) {
    try { out[r.kind] = { fetched_at: r.fetched_at, shape: maskShape(JSON.parse(r.body)) }; } catch { out[r.kind] = { error: 'unparseable' }; }
  }
  return out;
}
