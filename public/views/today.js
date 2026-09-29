// מסך "היום": חיבור ל-Google Health, הלילה האחרון, בדיקת בוקר, רישום מהיר וסיכום היומן של היום.
import { h, api, toast, ltr, fmtDate, fmtHM, fmtNum, fmtToday, fmtDay, ago, agoIso, todayISO } from '../lib.js';
import { quickChips } from './quick.js';
import { openProfile } from './profile.js';
import { renderInsights } from './insights.js';
import { openLibrary } from './why.js';
import { proteinLine } from './nutrition.js';

const FLASH = {
  connected: ['החיבור הושלם.', false],
  denied: ['לא אושרה גישה. אפשר לנסות שוב.', true],
  bad_state: ['הבקשה פגה. אפשר לנסות שוב.', true],
  exchange_failed: ['גוגל דחתה את החיבור. אפשר לנסות שוב.', true],
  no_refresh_token: ['גוגל לא החזירה אישור ארוך טווח. אפשר לנסות שוב.', true],
  scope_missing: ['לא סומנו כל ההרשאות. אפשר לנסות שוב ולסמן את כולן.', true],
  profile_missing: ['צריך להשלים את ההגדרה באפליקציית Google Health, ואז לחזור ולהתחבר.', true],
  identity_failed: ['לא הצלחנו לזהות את החשבון. אפשר לנסות שוב.', true],
  wrong_account: ['זה לא החשבון שחובר קודם. אפשר לנתק ולחבר מחדש.', true],
  not_configured: ['החיבור ל-Google Health עדיין לא הוגדר בשרת.', true],
};
// הסיבה שגוגל החזירה כשהחלפת הקוד נכשלה. הקודים אינם סודיים, והם מסבירים מה לתקן ומי צריך לתקן
const WHY = {
  invalid_client: 'גוגל דחתה את פרטי הלקוח ששמורים בשרת (Client ID או Client secret). זו שגיאת הגדרה שאי אפשר לתקן מהטלפון.',
  redirect_uri_mismatch: 'כתובת ההחזרה לא רשומה בלקוח של גוגל. צריך להוסיף אותה ב-Authorized redirect URIs: https://sleep.adaptation.work/api/gh/callback',
  invalid_grant: 'הקוד שגוגל שלחה פג או כבר נוצל. אפשר לנסות שוב מההתחלה.',
  unauthorized_client: 'הלקוח של גוגל לא מורשה לבקשה הזו. כדאי לוודא שסוג הלקוח בגוגל הוא Web application.',
};
// רמז על צורת הפרטים ששמורים בשרת (אורך ופורמט בלבד, בלי הערכים)
const HINT = {
  secret_short: (len) => `הסוד ששמור בשרת קצר מדי (${len} תווים, וסוד של גוגל הוא כ-35 תווים ומתחיל ב-GOCSPX-). כנראה הודבק ערך חלקי, או הערך המוסתר שמוצג בטבלה במקום הסוד החדש במלואו.`,
  secret_format: () => 'הסוד ששמור בשרת לא מתחיל ב-GOCSPX- כמו סוד רגיל של גוגל, ולכן כנראה הודבק ערך אחר.',
  id_format: () => 'ה-Client ID ששמור בשרת לא נראה כמו מזהה של גוגל (אמור להסתיים ב-.apps.googleusercontent.com).',
  looks_ok: () => 'הפורמט של הפרטים נראה תקין, ולכן כנראה הסוד שייך ללקוח אחר מה-Client ID שהוגדר, או שהוא בוטל בגוגל. יוצרים סוד חדש (Add secret) בדיוק בדף הלקוח שה-Client ID שלו הוא המוגדר.',
};
const whyText = (why, hint, len) => {
  const base = WHY[why] || `גוגל דחתה את החיבור${why && why !== 'unknown' ? ` (${why})` : ''}. אפשר לנסות שוב.`;
  return why === 'invalid_client' && HINT[hint] ? `${base} ${HINT[hint](len)}` : base;
};
// כשל בזיהוי החשבון אחרי שההחלפה הצליחה. 403 הוא בדרך כלל API שלא הופעל בפרויקט
const IDENT = {
  http_403: 'גוגל אישרה את החיבור, אבל ה-Google Health API לא הופעל בפרויקט ב-Google Cloud (APIs & Services, Library, Enable), או שהחשבון לא מורשה. זו שגיאת הגדרה.',
  http_401: 'גוגל אישרה את החיבור, אבל הטוקן נדחה בבדיקת הזהות. אפשר לנסות שוב.',
  http_429: 'גוגל הגבילה זמנית את הבקשות. אפשר לנסות שוב בעוד כמה דקות.',
};
const identText = (why) => IDENT[why] || `לא הצלחנו לזהות את החשבון${why && why !== 'unknown' ? ` (${why})` : ''}. אפשר לנסות שוב.`;
// נשמר במסד כ-exchange_failed:<why>[:<hint>:<len>] או identity_failed:<why>
const lastErrorText = (e) => {
  if (!e) return null;
  const [kind, why, hint, len] = e.split(':');
  return kind === 'exchange_failed' ? whyText(why, hint, len) : kind === 'identity_failed' ? identText(why) : null;
};

function takeFlash() {
  const p = new URLSearchParams(location.search);
  const code = p.get('gh');
  if (!code) return null;
  history.replaceState(null, '', '/');
  if (code === 'exchange_failed') return { text: whyText(p.get('why') || '', p.get('hint'), p.get('len')), warn: true };
  if (code === 'identity_failed') return { text: identText(p.get('why') || ''), warn: true };
  const f = FLASH[code];
  return f ? { text: f[0], warn: f[1] } : null;
}

let lastSync = null;   // תוצאת הסנכרון האחרון בסשן, לתצוגה טכנית

/* ---------- Google Health ---------- */
function connectionCard(s, reload) {
  const card = h('section', { class: 'card' }, h('h2', {}, 'Google Health'));
  if (!s.configured) { card.append(h('p', {}, 'החיבור עדיין לא הוגדר בשרת.')); return card; }
  if (s.status === 'connected') {
    const testing = s.tokenMode === 'testing';
    card.append(
      h('div', {}, h('span', { class: 'pill' }, h('span', { class: 'dot ok' }), 'מחובר')),
      h('div', { class: 'row' }, h('span', {}, 'סנכרון אחרון של השעון'), h('b', {}, agoIso(s.lastDeviceSync))),
      h('div', { class: 'row' }, h('span', {}, 'סנכרון אחרון לאפליקציה'), h('b', {}, s.lastSyncAt ? ago(s.lastSyncAt) : 'עוד לא')),
      h('div', { class: 'row' }, h('span', {}, 'סוג החיבור'), h('b', {}, testing ? `מצב בדיקה, יפוג ב-${fmtDay(s.refreshExpiresAt)}` : 'ארוך טווח')),
      h('div', { class: 'row' }, h('span', {}, 'הרשאות'), h('b', {}, s.scopesComplete ? 'מלאות' : 'חלקיות')),
    );
    if (!s.scopesComplete) card.append(h('div', { class: 'notice warn' }, 'חסרות הרשאות. אפשר להתחבר מחדש ולסמן את כולן.'));
    card.append(
      h('button', { class: 'btn', onclick: (e) => doSync(e.currentTarget, reload) }, 'סנכרון עכשיו'),
      h('div', { class: 'center' }, h('button', { class: 'link', onclick: async () => { if (!confirm('לנתק את Google Health? אפשר יהיה להתחבר שוב בכל רגע.')) return; await api('/api/gh/disconnect', { method: 'POST' }); lastSync = null; reload(); } }, 'ניתוק מ-Google Health')));
    return card;
  }
  if (s.status === 'needs_reauth') { card.append(h('div', { class: 'notice warn' }, 'החיבור פג ויש להתחבר מחדש.'), h('a', { class: 'btn', href: '/api/gh/connect' }, 'התחברות מחדש')); return card; }
  if (s.status === 'profile_missing') { card.append(h('p', {}, 'צריך להשלים את ההגדרה באפליקציית Google Health, ואז לנסות שוב.'), h('a', { class: 'btn', href: '/api/gh/connect' }, 'ניסיון חוזר')); return card; }
  const lastFail = lastErrorText(s.lastError);
  card.append(
    h('p', {}, 'כדי לראות את נתוני השינה מהשעון, צריך לאשר גישה פעם אחת. גוגל תציג מסך הסכמה, ואם כתוב בו "אפליקציה לא מאומתת", לוחצים Advanced ואז Go to Sleep Coach.'),
    lastFail ? h('div', { class: 'notice warn' }, 'הניסיון האחרון נכשל. ', lastFail) : null,
    h('a', { class: 'btn', href: '/api/gh/connect' }, 'חיבור ל-Google Health'),
    selftestBox());
  return card;
}

// בדיקה מהירה בלי הסכמה: האם גוגל מכירה את ה-Client ID והסוד ששמורים בשרת
function selftestBox() {
  const out = h('div', { class: 'note', role: 'status' });
  const btn = h('button', {
    class: 'link', type: 'button',
    onclick: async () => {
      btn.disabled = true; out.textContent = 'בודק מול גוגל...';
      const r = await api('/api/gh/selftest');
      btn.disabled = false;
      const d = r.data;
      if (!r.ok || !d) { out.textContent = 'הבדיקה לא הצליחה כרגע.'; return; }
      if (!d.configured) { out.textContent = 'פרטי הלקוח עוד לא הוגדרו בשרת.'; return; }
      out.textContent = d.clientOk ? `פרטי הלקוח תקינים: גוגל מכירה את ה-Client ID והסוד (${d.clientId}).`
        : `${whyText(d.error, d.hint, d.secLen)} Client ID בשרת: ${d.clientId || 'לא מוגדר'}.`;
    },
  }, 'בדיקת הגדרות החיבור');
  return h('div', { class: 'center' }, btn, out);
}

async function doSync(btn, reload) {
  btn.disabled = true; btn.textContent = 'מסנכרן...';
  lastSync = await api('/api/gh/sync', { method: 'POST', body: { days: 3 } });
  await reload();
  if (!lastSync.ok && lastSync.data && lastSync.data.error) toast(lastSync.data.error === 'needs_reauth' ? 'החיבור פג ויש להתחבר מחדש.' : `הסנכרון נכשל (${lastSync.data.error}).`);
}

/* ---------- הלילה האחרון ---------- */
function nightCard(night) {
  const card = h('section', { class: 'card' }, h('h2', {}, 'הלילה האחרון', night ? h('small', {}, fmtDate(night.night_date)) : null));
  if (!night) {
    card.append(h('p', {}, 'עוד אין נתוני שינה. אחרי סנכרון ראשון הלילה האחרון יופיע כאן. אם השעון לא סונכרן הבוקר, כדאי לפתוח את אפליקציית Google Health ואז ללחוץ "סנכרון עכשיו".'));
    return card;
  }
  const st = night.stages || {};
  const rec = night.recovery.same_day || night.recovery.previous_day || null;
  card.append(
    h('div', { class: 'big' }, ltr(fmtHM(night.minutes_asleep)), h('small', {}, 'שעות שינה')),
    h('p', { class: 'sub' }, 'מ-', ltr(night.bed || '-'), ' עד ', ltr(night.wake || '-')));
  const parts = [['deep', 'עמוקה', 'var(--deep)'], ['rem', 'REM', 'var(--rem)'], ['light', 'קלה', 'var(--light)'], ['awake', 'ערות', 'var(--awake)']];
  const total = parts.reduce((a, [k]) => a + (st[k] || 0), 0);
  if (total > 0) {
    const bar = h('div', { class: 'stages', 'aria-hidden': 'true' });
    for (const [k, , color] of parts) { const seg = h('i'); seg.style.setProperty('--w', `${((st[k] || 0) / total) * 100}%`); seg.style.background = color; bar.append(seg); }
    const legend = h('div', { class: 'legend' });
    for (const [k, label, color] of parts) { const span = h('span', {}, `${label} ${st[k] ?? '-'} דק׳`); span.style.setProperty('--c', color); legend.append(span); }
    card.append(bar, legend, h('p', { class: 'note' }, 'שלבי השינה מוערכים בדיוק מוגבל. הם מוצגים כאן לבדיקת החיבור בלבד.'));
  }
  if (night.segments && night.segments.length > 1) {
    const parts = night.segments.map((sg) => h('span', { class: 'ltr' }, `${sg.start} עד ${sg.end}`));
    card.append(h('p', { class: 'note' }, `${night.segments.length} קטעי שינה: `, parts[0], ...parts.slice(1).flatMap((x) => [' ו-', x]),
      '. האפליקציה מאחדת אותם ללילה אחד, כמו Google Health', night.gap_min ? `, והערות באמצע (${fmtHM(night.gap_min)} שעות) נכללת בערות` : '', '.'));
  }
  if (night.processed === 0) card.append(h('div', { class: 'notice' }, 'השלבים עדיין בעיבוד. כדאי לסנכרן שוב בעוד כמה דקות.'));
  if (rec) {
    const dev = rec.skin_nightly_c != null && rec.skin_baseline_c != null ? rec.skin_nightly_c - rec.skin_baseline_c : null;
    const tile = (val, label) => h('div', { class: 'tile' }, h('b', {}, ltr(val)), h('span', {}, label));
    card.append(h('div', { class: 'tiles' },
      tile(fmtNum(rec.hrv_rmssd_ms, 0), 'HRV (מ״ש)'), tile(fmtNum(rec.rhr_bpm, 0), 'דופק במנוחה'),
      tile(fmtNum(rec.br_bpm, 1), 'נשימות בדקה'), tile(fmtNum(rec.spo2_avg, 1), 'SpO2 ממוצע (%)'),
      tile(dev == null ? '-' : (dev > 0 ? '+' : '') + fmtNum(dev, 1), 'טמפרטורת עור מול הרגיל'), tile(night.efficiency_pct == null ? '-' : `${night.efficiency_pct}%`, 'יעילות (מחושב)')));
    if (!night.recovery.same_day) card.append(h('p', { class: 'note' }, `הרשומה היומית היא של ${night.recovery.previous_day.date}.`));
  } else card.append(h('p', { class: 'note' }, 'עוד אין מדדי התאוששות (HRV, דופק מנוחה) ללילה הזה.'));
  return card;
}

function techCard(night) {
  const d = h('details', { class: 'card' }, h('summary', {}, 'טכני: בדיקת חיבור ונתונים'));
  if (lastSync && lastSync.data && lastSync.data.status) {
    d.append(...Object.entries(lastSync.data.status).map(([k, v]) => h('div', { class: 'row' }, h('span', {}, ltr(k)), h('b', {}, v.ok ? `תקין${v.count != null ? ` (${v.count})` : ''}` : `שגיאה: ${v.error}${v.http ? ' ' + v.http : ''}`))));
  } else d.append(h('p', { class: 'note' }, 'עוד לא בוצע סנכרון בסשן הזה.'));
  d.append(h('button', {
    class: 'btn secondary',
    onclick: async (e) => {
      const b = e.currentTarget; b.disabled = true;
      const r = await api('/api/gh/shape');
      const text = JSON.stringify(r.data, null, 1);
      try { await navigator.clipboard.writeText(text); b.textContent = 'המבנה הועתק (בלי ערכים)'; } catch { d.append(h('pre', {}, text)); b.textContent = 'המבנה מוצג למטה'; }
      b.disabled = false;
    },
  }, 'העתקת מבנה הנתונים (בלי ערכים)'),
  h('p', { class: 'note' }, 'המבנה מכיל שמות שדות וסוגים בלבד, בלי מספרים ובלי תאריכים. אפשר להדביק אותו בשיחה עם העוזר כדי לוודא שהפענוח נכון.'));
  if (night) d.append(h('pre', {}, JSON.stringify(night.recovery, null, 1)));
  return d;
}

/* ---------- בדיקת בוקר ---------- */
function checkinCard(day) {
  const labels = [[1, 'מותש'], [2, 'עייף'], [3, 'בסדר'], [4, 'רענן'], [5, 'מצוין']];
  let cur = day.checkin && day.checkin.rested;
  const box = h('div', { class: 'chips' });
  const paint = () => box.replaceChildren(...labels.map(([n, l]) => h('button', {
    class: `chip${n === cur ? ' on' : ''}`, type: 'button',
    onclick: async () => { const r = await api('/api/checkin', { method: 'PUT', body: { rested: n } }); if (r.ok) { cur = n; paint(); toast('נרשם'); } else toast('הרישום נכשל.'); },
  }, l)));
  paint();
  return h('section', { class: 'card' }, h('h2', {}, 'איך הייתה ההתעוררות הבוקר?'), box, h('p', { class: 'note' }, 'הרגשה אישית היא חלק מהתמונה, לצד המספרים מהשעון.'));
}

/* ---------- היומן של היום ---------- */
function todayLogCard(day, reload) {
  const t = day.totals;
  return h('section', { class: 'card' }, h('h2', {}, 'היום ביומן', h('a', { href: '#food', class: 'link' }, 'ליומן האוכל')),
    h('div', { class: 'sum' },
      h('div', {}, h('b', {}, day.meals.length), h('span', {}, 'רישומים')),
      h('div', {}, h('b', {}, t.caffeine_mg ? `${t.caffeine_mg}` : '0'), h('span', {}, t.last_caffeine_time ? `קפאין מ״ג, אחרון ${t.last_caffeine_time}` : 'קפאין מ״ג')),
      h('div', {}, h('b', {}, day.workouts.length), h('span', {}, 'אימונים'))),
    proteinLine(day),
    h('label', { class: 'lbl' }, 'רישום מהיר'), quickChips(reload));
}

export async function renderToday(root) {
  root.replaceChildren(h('p', { class: 'boot' }, 'טוען...'));
  const reload = () => renderToday(root);
  const [st, ln, day, prof] = await Promise.all([api('/api/gh/status'), api('/api/gh/last-night'), api(`/api/day?date=${todayISO()}`), api('/api/profile')]);
  if (st.status === 401) return;
  if (!st.ok || !day.ok) { root.replaceChildren(h('p', { class: 'boot' }, 'לא הצלחנו לטעון. אפשר לרענן.')); return; }
  const flash = takeFlash();
  const profile = (prof.data && prof.data.profile) || {};
  const night = ln.data && ln.data.night;
  const connected = st.data.status === 'connected';
  root.replaceChildren(...[
    h('div', { class: 'topbar' },
      h('div', {}, h('h1', {}, profile.first_name ? `שלום ${profile.first_name}` : 'היום'), h('p', { class: 'sub' }, fmtToday())),
      h('div', { class: 'acts' }, h('button', { class: 'link', onclick: () => openProfile(profile, reload) }, 'פרופיל'),
        h('button', { class: 'link', onclick: async () => { await api('/api/logout', { method: 'POST' }); location.reload(); } }, 'יציאה'))),
    flash ? h('div', { class: flash.warn ? 'notice warn' : 'notice', role: 'status' }, flash.text) : null,
    // לא מחוברים: החיבור קודם, כי בלעדיו אין נתוני שינה. מחוברים: התובנות של היום למעלה, והחיבור יורד לתחתית
    connected ? null : connectionCard(st.data, reload),
    renderInsights(),
    !profile.usual_bed ? h('section', { class: 'card' }, h('h2', {}, 'התחלה'), h('p', {}, 'כמה פרטים קצרים (שעת שינה רגילה, גובה, ומה מפריע בשינה) עוזרים להתאים את התובנות.'), h('button', { class: 'btn secondary', onclick: () => openProfile(profile, reload) }, 'מילוי פרופיל')) : null,
    connected ? nightCard(night) : null,
    connected ? checkinCard(day.data) : null,
    todayLogCard(day.data, reload),
    h('section', { class: 'card' }, h('h2', {}, 'המאמן', h('a', { href: '#coach', class: 'link' }, 'לשיחה של היום')), h('p', { class: 'note' }, 'אפשר לשאול את המאמן על כל תובנה, או על כל דבר אחר שקשור לשינה, לאוכל ולאימונים. השיחה נפתחת מחדש כל בוקר, אחרי סנכרון מהשעון.')),
    connected ? connectionCard(st.data, reload) : null,
    connected ? techCard(night) : null,
    h('div', { class: 'center' }, h('button', { class: 'link', type: 'button', onclick: openLibrary }, 'ספריית המחקרים: כל הנושאים והמקורות')),
    h('p', { class: 'foot' }, 'גרסת בדיקה. בדיקות הדם בדרך.'),
  ].filter(Boolean));
}
