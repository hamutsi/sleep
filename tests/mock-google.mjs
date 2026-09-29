// שרת גוגל מדומה לבדיקות מקומיות: OAuth, Google Health API v4 ו-Gemini.
// המבנים נגזרים מהמסמכים הרשמיים (research/raw), לא מנתונים אמיתיים. הבדיקות מוכיחות שהצנרת שלנו נכונה.
// אימות מול גוגל האמיתית נעשה בחיבור הראשון דרך מסך "טכני". התאריכים יחסיים להיום, כדי שהבדיקות לא יירקבו.
import http from 'node:http';

export const SCOPES = [
  'https://www.googleapis.com/auth/googlehealth.sleep.readonly',
  'https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly',
  'https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly',
  'https://www.googleapis.com/auth/googlehealth.settings.readonly',
];

// יום המאמן מתחיל ב-04:00 בשעון ישראל, כמו בשרת
export const israelToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Date.now() - 4 * 3600 * 1000));
const addDays = (s, n) => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10); };
const parts = (s) => { const [y, m, d] = s.split('-').map(Number); return { year: y, month: m, day: d }; };   // בלי אפס מוביל, כמו במסמכים
const civil = (s, hh, mm) => ({ date: parts(s), time: { hours: hh, minutes: mm } });

export function buildFixtures(today) {
  const yesterday = addDays(today, -1);
  const day = parts(today);
  return {
    sleep: { dataPoints: [{
      name: 'users/111/dataTypes/sleep/dataPoints/222',
      dataSource: { recordingMethod: 'DERIVED', device: { displayName: 'Fitbit Air' }, platform: 'FITBIT' },
      sleep: {
        interval: { startTime: `${yesterday}T20:18:00Z`, startUtcOffset: '10800s', endTime: `${today}T04:02:00Z`, endUtcOffset: '10800s',
          civilStartTime: civil(yesterday, 23, 18), civilEndTime: civil(today, 7, 2) },
        type: 'STAGES',
        stages: [
          { startTime: `${yesterday}T20:18:00Z`, endTime: `${yesterday}T20:30:00Z`, startUtcOffset: '10800s', endUtcOffset: '10800s', type: 'AWAKE' },
          { startTime: `${yesterday}T20:30:00Z`, endTime: `${yesterday}T21:40:00Z`, startUtcOffset: '10800s', endUtcOffset: '10800s', type: 'LIGHT' },
        ],
        metadata: { stagesStatus: 'SUCCEEDED', processed: true, main: true },
        summary: {
          minutesInSleepPeriod: '464', minutesAfterWakeUp: '0', minutesToFallAsleep: '0', minutesAsleep: '407', minutesAwake: '57',
          stagesSummary: [{ type: 'AWAKE', minutes: '56', count: '12' }, { type: 'LIGHT', minutes: '198', count: '19' }, { type: 'DEEP', minutes: '114', count: '10' }, { type: 'REM', minutes: '94', count: '4' }],
        },
        createTime: `${today}T04:05:00Z`, updateTime: `${today}T04:06:00Z`,
      },
    }], nextPageToken: '' },
    'daily-heart-rate-variability': { dataPoints: [{ name: 'users/111/dataTypes/daily-heart-rate-variability/dataPoints/1',
      dailyHeartRateVariability: { date: day, averageHeartRateVariabilityMilliseconds: 38.4, deepSleepRootMeanSquareOfSuccessiveDifferencesMilliseconds: 41.2, entropy: 2.1, nonRemHeartRateBeatsPerMinute: '52' } }] },
    'daily-resting-heart-rate': { dataPoints: [{ name: 'users/111/dataTypes/daily-resting-heart-rate/dataPoints/1',
      dailyRestingHeartRate: { date: day, beatsPerMinute: '54', dailyRestingHeartRateMetadata: { calculationMethod: 'WITH_SLEEP' } } }] },
    'daily-oxygen-saturation': { dataPoints: [{ name: 'users/111/dataTypes/daily-oxygen-saturation/dataPoints/1',
      dailyOxygenSaturation: { date: day, averagePercentage: 96.1, lowerBoundPercentage: 93.4, upperBoundPercentage: 98.2, standardDeviationPercentage: 1.1 } }] },
    'daily-respiratory-rate': { dataPoints: [{ name: 'users/111/dataTypes/daily-respiratory-rate/dataPoints/1',
      dailyRespiratoryRate: { date: day, breathsPerMinute: 14.2 } }] },
    'daily-sleep-temperature-derivations': { dataPoints: [{ name: 'users/111/dataTypes/daily-sleep-temperature-derivations/dataPoints/1',
      dailySleepTemperatureDerivations: { date: day, nightlyTemperatureCelsius: 33.9, baselineTemperatureCelsius: 33.6, relativeNightlyStddev30dCelsius: 0.4 } }] },
    // לילה כמו שגוגל האמיתית החזירה: שני קטעים, השני מסומן nap, בלי civilTime, עם dataPointName ועם stagesSummary כפול
    sleepSplit: { dataPoints: [
      { dataPointName: 'users/111/dataTypes/sleep/dataPoints/501', sleep: {
        interval: { startTime: `${yesterday}T21:03:00Z`, startUtcOffset: '10800s', endTime: `${today}T01:27:00Z`, endUtcOffset: '10800s' }, type: 'STAGES',
        metadata: { stagesStatus: 'SUCCEEDED', processed: true },
        summary: { minutesInSleepPeriod: '264', minutesAfterWakeUp: '0', minutesToFallAsleep: '0', minutesAsleep: '258', minutesAwake: '6',
          stagesSummary: [{ type: 'AWAKE', minutes: '6', count: '2' }, { type: 'LIGHT', minutes: '124', count: '9' }, { type: 'REM', minutes: '51', count: '2' }, { type: 'DEEP', minutes: '83', count: '3' },
            { type: 'AWAKE', minutes: '6', count: '2' }, { type: 'LIGHT', minutes: '124', count: '9' }, { type: 'REM', minutes: '51', count: '2' }, { type: 'DEEP', minutes: '83', count: '3' }] },
        stages: [{ startTime: `${yesterday}T21:03:00Z`, endTime: `${yesterday}T21:10:00Z`, type: 'AWAKE' }] } },
      { dataPointName: 'users/111/dataTypes/sleep/dataPoints/502', sleep: {
        interval: { startTime: `${today}T03:14:00Z`, startUtcOffset: '10800s', endTime: `${today}T05:39:00Z`, endUtcOffset: '10800s' }, type: 'STAGES',
        metadata: { stagesStatus: 'SUCCEEDED', processed: true, nap: true },
        summary: { minutesInSleepPeriod: '145', minutesAfterWakeUp: '0', minutesToFallAsleep: '0', minutesAsleep: '128', minutesAwake: '17',
          stagesSummary: [{ type: 'AWAKE', minutes: '17', count: '3' }, { type: 'LIGHT', minutes: '61', count: '5' }, { type: 'REM', minutes: '36', count: '1' }, { type: 'DEEP', minutes: '31', count: '2' },
            { type: 'AWAKE', minutes: '17', count: '3' }, { type: 'LIGHT', minutes: '61', count: '5' }, { type: 'REM', minutes: '36', count: '1' }, { type: 'DEEP', minutes: '31', count: '2' }] },
        stages: [{ startTime: `${today}T03:14:00Z`, endTime: `${today}T03:21:00Z`, type: 'AWAKE' }] } },
    ], nextPageToken: '' },
    devices: { pairedDevices: [{ deviceVersion: 'Fitbit Air', lastSyncTime: `${today}T04:20:00Z`, batteryLevel: 80, batteryStatus: 'HIGH', deviceType: 'TRACKER', features: [] }] },
  };
}

const readBody = (req) => new Promise((res) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => res(b)); });
const send = (res, status, obj) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
const cand = (parts_) => ({ candidates: [{ finishReason: 'STOP', content: { role: 'model', parts: parts_ } }], usageMetadata: { promptTokenCount: 1180, candidatesTokenCount: 200 } });

const MEAL = {
  name: 'פסטה ברוטב שמנת', kind: 'meal',
  items: [
    { name: 'פסטה מבושלת', grams: 250, kcal: 390, protein_g: 14, carbs_g: 78, sugar_g: 3, fiber_g: 5, fat_g: 2, sat_fat_g: 0.5 },
    { name: 'רוטב שמנת', grams: 100, kcal: 180, protein_g: 3, carbs_g: 6, sugar_g: 4, fiber_g: 0, fat_g: 16, sat_fat_g: 10 },
  ],
  caffeine_mg: 0, alcohol_g: 14, glycemic_load: 'high', confidence: 'medium',
  questions: [{ q: 'האם היה גבינה מגוררת?', options: ['כן', 'לא'] }], note: 'הערכה לפי נפח הצלחת.',
  totals: { kcal: 99999 },   // המודל טועה בסיכום, והשרת אמור להתעלם ולחשב בעצמו
};

export function startMock(port, { clientId, clientSecret, appUrl }) {
  const today = israelToday();
  let fixtures = buildFixtures(today);
  const st = {
    n: 0, validAccess: null, calls: [], tokenGrants: [], revoked: [],
    identity: { healthUserId: '111', legacyUserId: 'A1B2C3' }, identityStatus: 200,
    scope: SCOPES.join(' '), noRefresh: false, invalidGrant: false, forceTokenError: null, refreshExpiresIn: 604799,
    gemini: [], geminiStatus: 200, geminiEmpty: false, geminiReply: null, geminiBadKey: false, sleepEmpty: false, splitNight: false,
  };
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://mock');
    const raw = await readBody(req);
    if (url.pathname === '/__control' && req.method === 'POST') { Object.assign(st, JSON.parse(raw || '{}')); return send(res, 200, { ok: true }); }
    if (url.pathname === '/__state') return send(res, 200, { ...st, today });

    // Gemini מדומה: בודק את צורת הבקשה לפי התיעוד הרשמי
    if (url.pathname.startsWith('/gemini/v1beta/')) {
      const m = url.pathname.match(/^\/gemini\/v1beta\/models\/([^:]+):generateContent$/);
      const body = raw ? JSON.parse(raw) : {};
      st.gemini.push({ model: m && m[1], key: req.headers['x-goog-api-key'], body, search: url.search });
      // גוגל האמיתית מחזירה 400 (ולא 401 או 403) על מפתח לא תקין
      if (st.geminiBadKey || req.headers['x-goog-api-key'] !== 'test-gemini-key') return send(res, 400, { error: { code: 400, message: 'API key not valid. Please pass a valid API key.', status: 'INVALID_ARGUMENT' } });
      if (req.method === 'GET') return send(res, 200, { name: url.pathname.replace('/gemini/v1beta/', '') });   // שליפת פרטי מודל, לבדיקה עצמית של המפתח
      if (st.geminiStatus && st.geminiStatus !== 200) return send(res, st.geminiStatus, { error: { message: 'forced' } });
      if (!m) return send(res, 404, { error: { message: 'bad path' } });
      const gc = body.generationConfig || {};
      const props = gc.responseJsonSchema && gc.responseJsonSchema.properties;

      if (body.tools) {   // שיחת מאמן עם כלים
        if (st.geminiReply) return send(res, 200, cand([{ text: st.geminiReply }]));
        const last = body.contents.at(-1);
        const fr = (last.parts || []).find((p) => p.functionResponse);
        if (!fr) return send(res, 200, cand([{ functionCall: { id: 'fc_1', name: 'get_nights', args: { days: 7 } }, thoughtSignature: 'SIG-abc' }]));
        const modelTurn = body.contents.at(-2);
        const echoed = modelTurn.role === 'model' && modelTurn.parts[0].thoughtSignature === 'SIG-abc' && fr.functionResponse.id === 'fc_1' && last.role === 'user';
        if (!echoed) return send(res, 400, { error: { message: 'thought signature, id or role not echoed correctly' } });
        const n = ((fr.functionResponse.response || {}).result || {}).nights;
        return send(res, 200, cand([{ text: `לפי ${n ? n.length : -1} לילות בנתונים, הכול נראה יציב.` }]));
      }
      if (props && props.quick_replies) {   // פתיחת יום
        const enumIds = props.topics && props.topics.items && props.topics.items.enum;
        return send(res, 200, cand([{ text: JSON.stringify({ text: 'בוקר טוב. לפי הנתונים ישנתם בערך שבע שעות. שווה לדבר היום על שעת ההירדמות. במה נתחיל?', quick_replies: ['למה זה קרה?', 'מה הכי חשוב היום?'],
          ...(enumIds && enumIds.length ? { topics: [enumIds[0], 'invented_topic_id'] } : {}) }) }]));   // מדמה מודל שמחזיר גם מזהה שלא קיים
      }
      if (st.geminiEmpty) return send(res, 200, cand([{ text: JSON.stringify({ name: 'x', kind: 'meal', items: [], caffeine_mg: 0, alcohol_g: 0, glycemic_load: 'low', confidence: 'low', questions: [], note: '' }) }]));
      return send(res, 200, cand([{ text: JSON.stringify(MEAL) }]));   // ניתוח ארוחה
    }

    if (url.pathname === '/token' && req.method === 'POST') {
      const f = new URLSearchParams(raw);
      st.tokenGrants.push(f.get('grant_type'));
      if (f.get('client_id') !== clientId || f.get('client_secret') !== clientSecret) return send(res, 401, { error: 'invalid_client' });
      if (f.get('grant_type') === 'authorization_code') {
        if (st.forceTokenError) return send(res, 401, { error: st.forceTokenError, error_description: 'forced by test' });
        if (f.get('code') !== 'mockcode' || f.get('redirect_uri') !== `${appUrl}/api/gh/callback`) return send(res, 400, { error: 'invalid_grant' });
        st.validAccess = `mock-access-${++st.n}`;
        const out = { access_token: st.validAccess, expires_in: 3599, scope: st.scope, token_type: 'Bearer' };
        if (!st.noRefresh) out.refresh_token = 'mock-refresh-1';
        if (st.refreshExpiresIn) out.refresh_token_expires_in = st.refreshExpiresIn;
        return send(res, 200, out);
      }
      if (f.get('grant_type') === 'refresh_token') {
        if (st.invalidGrant || f.get('refresh_token') !== 'mock-refresh-1') return send(res, 400, { error: 'invalid_grant' });
        st.validAccess = `mock-access-${++st.n}`;
        return send(res, 200, { access_token: st.validAccess, expires_in: 3599, scope: st.scope, token_type: 'Bearer' });
      }
      return send(res, 400, { error: 'unsupported_grant_type' });
    }
    if (url.pathname === '/revoke' && req.method === 'POST') { st.revoked.push(new URLSearchParams(raw).get('token')); return send(res, 200, {}); }

    if (url.pathname.startsWith('/v4/')) {
      const auth = req.headers.authorization || '';
      st.calls.push({ path: url.pathname, search: url.search, auth });
      if (!st.validAccess || auth !== `Bearer ${st.validAccess}`) return send(res, 401, { error: { status: 'UNAUTHENTICATED', message: 'bad token' } });
      if (url.pathname === '/v4/users/me/identity') return st.identityStatus === 200 ? send(res, 200, st.identity) : send(res, st.identityStatus, { error: { status: 'FAILED_PRECONDITION', message: 'profile' } });
      if (url.pathname === '/v4/users/me/pairedDevices') return send(res, 200, fixtures.devices);
      const m = url.pathname.match(/^\/v4\/users\/me\/dataTypes\/([a-z-]+)\/dataPoints(:reconcile)?$/);
      if (m && m[1] === 'sleep' && st.sleepEmpty) return send(res, 200, { dataPoints: [], nextPageToken: '' });
      if (m && m[1] === 'sleep' && st.splitNight) return send(res, 200, fixtures.sleepSplit);
      if (m && fixtures[m[1]]) return send(res, 200, fixtures[m[1]]);
      return send(res, 404, { error: { status: 'NOT_FOUND', message: url.pathname } });
    }
    send(res, 404, { error: 'mock_not_found' });
  });
  server.keepAliveTimeout = 120000;   // חיבורים ארוכים, כדי שהבדיקות לא ייכשלו אחרי השהיה בין קריאות
  server.headersTimeout = 125000;
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve({ st, today, close: () => server.close() })));
}
