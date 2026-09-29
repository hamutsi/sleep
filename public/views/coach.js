// המאמן: שיחה חדשה בכל יום. לפני שהיא נפתחת, השרת מסנכרן מהשעון ומחשב מחדש. אם נתוני הלילה עוד לא הגיעו, אומרים את זה ולא מנחשים.
import { h, api, toast, openSheet, spinner, ltr, fmtDate, agoIso } from '../lib.js';
import { whyButton, openLibrary } from './why.js';

const GATE_TEXT = {
  no_connection: 'Google Health עדיין לא מחובר, ולכן אין נתוני שינה. המאמן מדבר על מה שכן רשום ביומן.',
  needs_reauth: 'החיבור ל-Google Health פג. אפשר להתחבר מחדש במסך "היום".',
  sync_failed: 'הסנכרון מהשעון לא הצליח כרגע, והמאמן מסתמך על הנתונים האחרונים שיש.',
  no_sleep_today: 'נתוני הלילה של היום לא הגיעו מהשעון.',
  waiting_for_watch: 'נתוני הלילה של היום לא הגיעו מהשעון.',
};
const ERR = {
  gemini_quota: 'המכסה של Gemini מלאה כרגע. אפשר לנסות שוב בעוד דקה.',
  daily_cap: 'הגענו לתקרת הקריאות היומית. היא מגינה על המכסה ועל העלות, ותיפתח שוב מחר.',
  gemini_key: 'גוגל דחתה את מפתח Gemini ששמור בשרת. זו שגיאת הגדרה: צריך להזין את המפתח מחדש. אפשר ללחוץ על "בדיקת מפתח Gemini" כדי לראות מה שמור.',
  gemini_billing: 'החיבור ל-Gemini דורש חיוב פעיל בחשבון של גוגל.',
  gemini_not_configured: 'מפתח Gemini עוד לא הוגדר בשרת.',
  gemini_unavailable: 'Gemini לא זמין כרגע. אפשר לנסות שוב בעוד רגע.',
  gemini_bad_response: 'התשובה מ-Gemini לא הייתה תקינה. אפשר לנסות שוב.',
  gemini_bad_request: 'הבקשה ל-Gemini נדחתה. אפשר לנסות ניסוח אחר.',
  gemini_too_many_steps: 'המאמן לא הצליח להשלים את הבדיקה. אפשר לנסות שוב.',
  bad_input: 'ההודעה לא תקינה או ארוכה מדי.',
};
const errText = (r) => ERR[r.data && r.data.error] || (r.status === 0 ? 'אין חיבור לאינטרנט.' : 'משהו השתבש. אפשר לנסות שוב.');

const bubble = (m) => {
  const el = h('div', { class: `msg ${m.role === 'user' ? 'me' : 'bot'}` }, m.text);
  const topics = m.role !== 'user' && m.meta && m.meta.topics;
  if (topics && topics.length) el.append(h('div', { class: 'msg-why' }, whyButton(topics)));   // המקורות נטענים מהספרייה המאומתת, לא מהמודל
  return el;
};

// בדיקה מהירה של המפתח ששמור בשרת: האם גוגל מקבלת אותו, ומה הצורה שלו (אורך ותחילית בלבד, בלי הערך)
function keyCheckBox() {
  const out = h('div', { class: 'note', role: 'status' });
  const btn = h('button', {
    class: 'link', type: 'button',
    onclick: async () => {
      btn.disabled = true; out.textContent = 'בודק מול גוגל...';
      const r = await api('/api/coach/selftest');
      btn.disabled = false;
      const d = r.data;
      if (!r.ok || !d) { out.textContent = 'הבדיקה לא הצליחה כרגע.'; return; }
      if (!d.hasKey) { out.textContent = 'לא הוגדר מפתח Gemini בשרת.'; return; }
      out.textContent = d.ok ? 'המפתח תקין: גוגל מקבלת אותו.'
        : `גוגל דחתה את המפתח. אורך המפתח בשרת: ${d.len} תווים${d.prefixOk ? '' : ' והוא לא מתחיל ב-AIza או ב-AQ.'} (מפתח תקין מתחיל ב-AIza או ב-AQ.). כדאי ליצור מפתח חדש ב-Google AI Studio ולהזין אותו מחדש.`;
    },
  }, 'בדיקת מפתח Gemini');
  return h('div', { class: 'center' }, btn, out);
}

function disabledCard(s) {
  return h('section', { class: 'card' }, h('h2', {}, 'המאמן עוד לא מופעל'),
    h('p', {}, s.hasKey ? 'המאמן שולח נתוני בריאות ל-Gemini, ולכן מופעל רק אחרי שמצהירים על סוג המפתח: בחיוב (מומלץ, גוגל לא משתמשת בתוכן) או חינמי (גוגל עשויה להשתמש בתוכן לשיפור מוצרים).'
      : 'עוד לא הוגדר מפתח Gemini בשרת.'),
    h('p', { class: 'note' }, 'ההצהרה נעשית פעם אחת בסקריפט ההזנה של הסודות (שאלה 3), והמאמן נפתח מיד.'));
}

export async function renderCoach(root) {
  const body = h('div');
  root.replaceChildren(h('h1', {}, 'מאמן'), h('p', { class: 'sub' }, 'שיחה חדשה בכל יום, לפי הנתונים העדכניים'), body);
  body.replaceChildren(spinner('טוען...'));
  const st = await api('/api/coach/status');
  if (!st.ok) { body.replaceChildren(h('p', { class: 'empty' }, 'לא הצלחנו לטעון. אפשר לרענן.')); return; }
  if (!st.data.enabled) { body.replaceChildren(disabledCard(st.data)); return; }
  await start(body, st.data, false, 0);
}

async function start(body, status, force, attempt) {
  body.replaceChildren(spinner(force ? 'מכינים את הפתיחה בלי נתוני הלילה...' : 'מסנכרנים מהשעון ומכינים את הפתיחה של היום...'));
  const r = await api('/api/coach/start', { method: 'POST', body: { force } });
  if (r.status === 202 && attempt < 15) { await new Promise((res) => setTimeout(res, 2000)); return start(body, status, force, attempt + 1); }   // מכשיר אחר מכין את הפתיחה
  if (!r.ok) {
    body.replaceChildren(h('section', { class: 'card' }, h('p', {}, errText(r)), h('button', { class: 'btn', onclick: () => start(body, status, force, 0) }, 'ניסיון חוזר'), keyCheckBox()));
    return;
  }
  const { messages, gate } = r.data;
  if (gate && gate.state === 'waiting_for_watch' && !messages.length) {
    body.replaceChildren(h('section', { class: 'card' }, h('h2', {}, 'ממתינים לשעון'),
      h('p', {}, `${GATE_TEXT.waiting_for_watch} השעון מעלה נתונים רק אחרי שהטלפון מסנכרן אותו, ולכן צריך לפתוח את אפליקציית Google Health ולחכות דקה.`),
      h('div', { class: 'row' }, h('span', {}, 'סנכרון אחרון של השעון'), h('b', {}, gate.lastDeviceSync ? agoIso(gate.lastDeviceSync) : 'לא ידוע')),
      h('button', { class: 'btn', onclick: () => start(body, status, false, 0) }, 'בדיקה מחדש'),
      h('button', { class: 'btn secondary', onclick: () => start(body, status, true, 0) }, 'להמשיך בלי נתוני הלילה')));
    return;
  }
  renderThread(body, status, messages, gate);
}

function renderThread(body, status, messages, gate) {
  const list = h('div', { class: 'chat' });
  const chips = h('div', { class: 'chips' });
  const input = h('input', { class: 'inp', type: 'text', maxlength: '1000', placeholder: 'שאלה על השינה, האוכל או האימונים', enterkeyhint: 'send', 'aria-label': 'הודעה' });
  const send = h('button', { class: 'btn small', type: 'submit' }, 'שליחה');
  let busy = false;

  const paintChips = () => {
    const last = messages[messages.length - 1];
    const qr = last && last.role === 'assistant' && last.meta && last.meta.quick_replies;
    chips.replaceChildren(...(qr || []).map((q) => h('button', { class: 'chip', type: 'button', onclick: () => ask(q) }, q)));
  };
  const paint = () => { list.replaceChildren(...messages.map(bubble)); paintChips(); };

  async function ask(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true; send.disabled = true; input.value = '';
    const mine = { role: 'user', text };
    messages.push(mine); paint();
    const typing = h('div', { class: 'msg bot typing' }, spinner('המאמן בודק את הנתונים...'));
    list.append(typing);
    typing.scrollIntoView({ block: 'end', behavior: 'smooth' });
    const r = await api('/api/coach/message', { method: 'POST', body: { text } });
    typing.remove();
    if (r.ok) messages.push(r.data.message);
    else { messages.pop(); input.value = text; toast(errText(r)); }
    paint(); busy = false; send.disabled = false;
    if (r.ok) list.lastChild.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  const freshness = [];
  if (gate && GATE_TEXT[gate.state] && gate.state !== 'waiting_for_watch') freshness.push(h('div', { class: 'notice warn' }, GATE_TEXT[gate.state]));
  if (gate && gate.state === 'waiting_for_watch') freshness.push(h('div', { class: 'notice warn' }, 'נתוני הלילה של היום לא הגיעו מהשעון, ולכן הפתיחה לא מתבססת עליהם.'));
  const asOf = messages[0] && messages[0].meta && messages[0].meta.as_of;
  const info = h('p', { class: 'note' }, asOf ? `הפתיחה הוכנה ב-${asOf.split(' ')[1]}` : '', gate && gate.lastDeviceSync ? ` · סנכרון אחרון של השעון ${agoIso(gate.lastDeviceSync)}` : '');
  const tierNote = status.tier === 'free' ? h('div', { class: 'notice warn' }, 'המפתח מוגדר כחינמי: גוגל עשויה להשתמש בשיחה לשיפור מוצרים. מומלץ לעבור למפתח בחיוב.') : null;

  const form = h('form', { class: 'composer', onsubmit: (e) => { e.preventDefault(); ask(input.value); } }, input, send);
  const prev = h('span', {}, h('button', { class: 'link', type: 'button', onclick: openPrevious }, 'שיחות קודמות'), h('button', { class: 'link', type: 'button', onclick: openLibrary }, 'ספריית המחקרים'));
  body.replaceChildren(...[tierNote, ...freshness, list, chips, form, h('div', { class: 'center' }, prev), info,
    h('p', { class: 'note center' }, 'המאמן אינו תחליף לרופא.ה ולא ממליץ לשנות תרופות.'),
    status.usage30 ? h('p', { class: 'note center' }, `שימוש ב-Gemini ב-30 הימים האחרונים: ${status.usage30.calls} קריאות, ${(status.usage30.tokens_in / 1000).toFixed(0)} אלף טוקנים נכנסים ו-${(status.usage30.tokens_out / 1000).toFixed(0)} אלף יוצאים. עלות משוערת בשכבת תשלום: `, h('span', { class: 'ltr' }, `$${status.usage30.usd.toFixed(2)}`), ' (מחירון גוגל, הערכה). בשכבה חינמית אין חיוב.') : null].filter(Boolean));
  paint();
}

async function openPrevious() {
  const sh = openSheet({ title: 'שיחות קודמות', content: spinner('טוען...') });
  const r = await api('/api/coach/threads');
  if (!r.ok) { sh.setContent(h('p', { class: 'note' }, 'לא הצלחנו לטעון.')); return; }
  const rows = r.data.threads;
  sh.setContent(h('div', {},
    h('p', { class: 'note' }, 'כל יום נפתחת שיחה חדשה. שיחות קודמות פתוחות לקריאה.'),
    ...(rows.length ? rows.map((t) => h('button', { class: 'hist', type: 'button', onclick: () => openThread(sh, t.coach_date) },
      h('b', {}, fmtDate(t.coach_date)), h('span', {}, `${t.messages} הודעות · ${t.preview}`))) : [h('p', { class: 'empty' }, 'זו השיחה הראשונה.')])));
}

async function openThread(sh, date) {
  sh.setContent(spinner('טוען...'));
  sh.setTitle(fmtDate(date));
  const r = await api(`/api/coach/thread?date=${date}`);
  if (!r.ok) { sh.setContent(h('p', { class: 'note' }, 'לא הצלחנו לטעון.')); return; }
  sh.setContent(h('div', {}, h('div', { class: 'chat' }, r.data.messages.map(bubble)), h('button', { class: 'btn secondary', onclick: () => sh.close() }, 'סגירה')));
}
