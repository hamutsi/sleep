// כלים משותפים לממשק: בניית DOM בטוחה, קריאות API, עיצוב תאריכים ומספרים, גיליון תחתון והודעה קצרה.
// אין כאן שום נתון אישי. אין innerHTML, ולכן אין הזרקת קוד מנתונים.
export const $ = (s, r = document) => r.querySelector(s);

export const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
};

export const svgIcon = (d, cls = 'ico-svg') => {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', cls);
  const p = document.createElementNS(ns, 'path');
  for (const [k, v] of Object.entries({ d, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })) p.setAttribute(k, v);
  svg.append(p);
  return svg;
};

export const moonIcon = () => svgIcon('M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z', 'moon');

/* ---------- API ---------- */
let onUnauth = () => {};
export const setUnauthHandler = (fn) => { onUnauth = fn; };

export async function api(path, { method = 'GET', body } = {}) {
  const init = { method, credentials: 'same-origin', headers: {} };
  if (method !== 'GET') { init.headers['content-type'] = 'application/json'; init.body = JSON.stringify(body || {}); }
  let r;
  try { r = await fetch(path, init); } catch { return { ok: false, status: 0, data: null }; }
  let data = null;
  try { data = await r.json(); } catch { /* תשובה ריקה */ }
  if (r.status === 401 && path !== '/api/login') onUnauth();
  return { ok: r.ok, status: r.status, data };
}

/* ---------- תאריכים ומספרים ---------- */
export const plural = (n, one, many) => (n === 1 ? one : `${n} ${many}`);
export const fmtHM = (m) => (m == null ? '-' : `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`);
export const fmtNum = (v, d = 0) => (v == null ? '-' : Number(v).toFixed(d));
export const ltr = (text) => h('span', { class: 'ltr' }, text);

// מבודד רצפים לטיניים (HRV, HbA1c, mg/dL, Life's Essential 8) בתוך טקסט עברי. בלי זה סוגריים ופיסוק סביב מונח באנגלית מתהפכים.
// LRI ו-PDI הם תווי בקרה שלא נראים (U+2066 ו-U+2069). מספרים בלבד לא נכללים, כי הם כבר מוצגים נכון
const LATIN = /[A-Za-z](?:[A-Za-z0-9'’\/%+.\-]*[A-Za-z0-9%])?(?:[ ][A-Za-z0-9](?:[A-Za-z0-9'’\/%+.\-]*[A-Za-z0-9%])?)*/g;
export const bidi = (s) => (typeof s === 'string' ? s.replace(LATIN, (m) => `\u2066${m}\u2069`) : s);

export const todayISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export const nowHM = () => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
export const addDaysISO = (ymd, n) => { const [y, m, d] = ymd.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10); };

export const fmtDate = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
};
export const fmtToday = () => new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Jerusalem' }).format(new Date());
export const fmtDay = (sec) => new Date(sec * 1000).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', timeZone: 'Asia/Jerusalem' });
export const ago = (sec) => {
  const s = Math.max(0, Math.floor(Date.now() / 1000) - sec);
  if (s < 90) return 'ממש עכשיו';
  if (s < 3600) return `לפני ${plural(Math.round(s / 60), 'דקה', 'דקות')}`;
  if (s < 86400) return `לפני ${plural(Math.round(s / 3600), 'שעה', 'שעות')}`;
  return `לפני ${plural(Math.round(s / 86400), 'יום', 'ימים')}`;
};
export const agoIso = (iso) => (iso ? ago(Math.floor(new Date(iso).getTime() / 1000)) : '-');

/* ---------- הודעה קצרה ---------- */
let toastEl, toastTimer;
export function toast(msg) {
  if (!toastEl) { toastEl = h('div', { class: 'toast', role: 'status' }); document.body.append(toastEl); }
  toastEl.textContent = msg;
  toastEl.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('on'), 2200);
}

/* ---------- גיליון תחתון ---------- */
export function openSheet({ title, content } = {}) {
  const backdrop = h('div', { class: 'backdrop' });
  const body = h('div', { class: 'sheet-body' }, content);
  const heading = h('h3', {}, title || '');
  const sheet = h('aside', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': title || 'חלון' }, h('div', { class: 'grab' }), heading, body);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    sheet.classList.remove('on'); backdrop.classList.remove('on');
    setTimeout(() => { sheet.remove(); backdrop.remove(); }, 280);
  };
  backdrop.addEventListener('click', close);
  document.body.append(backdrop, sheet);
  requestAnimationFrame(() => { sheet.classList.add('on'); backdrop.classList.add('on'); });
  return { close, body, setTitle: (t) => { heading.textContent = t; }, setContent: (node) => { body.replaceChildren(node); sheet.scrollTop = 0; } };
}

export const spinner = (text) => h('div', { class: 'spin-row' }, h('i', { class: 'spin' }), h('span', {}, text));

/* ---------- תמונות: הקטנה בדפדפן לפני שליחה ---------- */
const blobToB64 = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(blob); });

async function decodeImage(file) {
  try { return await createImageBitmap(file); }
  catch {
    return await new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = URL.createObjectURL(file); });
  }
}

// מחזיר תמונה לניתוח (עד 1024 פיקסלים) ותמונה ממוזערת לשמירה (עד 320). התמונה המלאה לא נשמרת.
export async function prepareImage(file) {
  const src = await decodeImage(file);
  const draw = (max, q) => {
    const s = Math.min(1, max / Math.max(src.width, src.height));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(src.width * s)); c.height = Math.max(1, Math.round(src.height * s));
    c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
    return new Promise((res) => c.toBlob(res, 'image/jpeg', q));
  };
  const [big, small] = [await draw(1024, 0.75), await draw(320, 0.7)];
  return { image: await blobToB64(big), thumb: await blobToB64(small) };
}

// הקלט חייב להיות מחובר ל-DOM. באייפון (במיוחד באפליקציה שמורה במסך הבית) קלט נפרד נאסף על ידי הזבל של הדפדפן לפני שהאירוע change מגיע,
// והתמונה "עולה" אבל שום דבר לא קורה
export const pickFile = (capture) => new Promise((res) => {
  const input = h('input', { type: 'file', accept: 'image/*', class: 'file-hidden', 'aria-hidden': 'true', tabindex: '-1', ...(capture ? { capture: 'environment' } : {}) });
  const done = (f) => { input.remove(); res(f); };
  input.addEventListener('change', () => done(input.files && input.files[0] ? input.files[0] : null));
  input.addEventListener('cancel', () => done(null));
  document.body.append(input);
  input.click();
});
