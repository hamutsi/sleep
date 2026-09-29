// יומן אוכל: צילום ארוחה, תיאור בכתב או רישום מהיר. Gemini מנתח, השרת מחשב את הסכומים, והמשתמש מאשר לפני שמירה.
import { h, api, toast, openSheet, spinner, ltr, todayISO, nowHM, addDaysISO, fmtDate, prepareImage, pickFile } from '../lib.js';
import { quickChips } from './quick.js';
import { nutritionCard } from './nutrition.js';

const GL = { low: 'עומס גליקמי נמוך', medium: 'עומס גליקמי בינוני', high: 'עומס גליקמי גבוה' };
const CONF = { high: 'גבוהה', medium: 'בינונית', low: 'נמוכה' };
const EMOJI = { meal: '🍽️', snack: '🍪', drink: '🥤' };
const ERRORS = {
  no_food_detected: 'לא זוהה אוכל בתמונה. אפשר לנסות שוב או לתאר בכתב.',
  gemini_quota: 'המכסה של Gemini מלאה כרגע. אפשר לנסות שוב בעוד דקה.',
  gemini_key: 'יש בעיה במפתח Gemini. צריך לבדוק אותו בהגדרות השרת.',
  gemini_billing: 'החיבור ל-Gemini דורש חיוב פעיל בחשבון של גוגל.',
  gemini_not_configured: 'מפתח Gemini עוד לא הוגדר בשרת.',
  gemini_unavailable: 'Gemini לא זמין כרגע. אפשר לנסות שוב בעוד רגע.',
  gemini_bad_response: 'התשובה מ-Gemini לא הייתה תקינה. אפשר לנסות שוב.',
  gemini_bad_request: 'הבקשה ל-Gemini נדחתה. אפשר לנסות תמונה אחרת.',
};

const tag = (text, warn = false) => h('span', { class: warn ? 'tg w' : 'tg' }, text);

export function mealTags(m) {
  const t = [];
  if (m.kcal != null) t.push(tag(`${m.kcal} קק״ל`));
  if (m.protein_g) t.push(tag(`חלבון ${Math.round(m.protein_g)} גר׳`));
  if (m.carbs_g) t.push(tag(`פחמימות ${Math.round(m.carbs_g)} גר׳`));
  if (m.caffeine_mg) t.push(tag(`קפאין ${m.caffeine_mg} מ״ג`, true));
  if (m.alcohol_g) t.push(tag(`אלכוהול ${m.alcohol_g} גר׳`, true));
  if (m.glycemic_load) t.push(tag(GL[m.glycemic_load], m.glycemic_load === 'high'));
  return t;
}

export async function renderFood(root) {
  const state = { date: todayISO() };
  const box = h('div');
  const textInp = h('input', { class: 'inp', type: 'text', placeholder: 'למשל: שקשוקה ושתי פרוסות לחם', maxlength: '300', 'aria-label': 'תיאור בכתב' });

  async function load() {
    const r = await api(`/api/day?date=${state.date}`);
    if (!r.ok) { box.replaceChildren(h('p', { class: 'empty' }, 'לא הצלחנו לטעון את היומן.')); return; }
    const d = r.data;
    const isToday = state.date === todayISO();
    const bar = h('div', { class: 'datebar' },
      h('button', { 'aria-label': 'יום קודם', onclick: () => { state.date = addDaysISO(state.date, -1); load(); } }, '›'),
      h('b', {}, isToday ? 'היום' : fmtDate(state.date)),
      h('button', { 'aria-label': 'יום הבא', disabled: isToday, onclick: () => { state.date = addDaysISO(state.date, 1); load(); } }, '‹'));
    const sum = h('div', { class: 'sum' },
      h('div', {}, h('b', {}, d.totals.caffeine_mg ? `${d.totals.caffeine_mg} מ״ג` : '0'), h('span', {}, d.totals.last_caffeine_time ? `קפאין, אחרון ${d.totals.last_caffeine_time}` : 'קפאין')),
      h('div', {}, h('b', {}, `${d.totals.alcohol_g} גר׳`), h('span', {}, 'אלכוהול')),
      h('div', {}, h('b', {}, d.totals.last_meal_time || '-'), h('span', {}, 'ארוחה אחרונה')));
    const list = d.meals.length
      ? d.meals.map((m) => h('div', { class: 'item' },
        m.has_thumb ? h('img', { src: `/api/meals/${m.id}/thumb`, alt: '', width: '56', height: '56', loading: 'lazy' }) : h('div', { class: 'ico' }, EMOJI[m.kind] || '🍽️'),
        h('div', { class: 'grow' }, h('div', { class: 't' }, ltr(m.local_time)), h('div', { class: 'n' }, m.name), h('div', { class: 'tags' }, mealTags(m))),
        h('button', { class: 'x', 'aria-label': 'מחיקה', onclick: async () => { if (!confirm(`למחוק את "${m.name}"?`)) return; const x = await api(`/api/meals/${m.id}`, { method: 'DELETE' }); if (x.ok) { toast('נמחק'); load(); } } }, '×')))
      : [h('p', { class: 'empty' }, isToday ? 'עוד אין רישומים היום. אפשר לצלם ארוחה או לרשום קפה.' : 'אין רישומים ביום הזה.')];
    box.replaceChildren(bar, nutritionCard(d), h('section', { class: 'card' }, sum, ...list));
  }

  /* ---------- ניתוח ---------- */
  async function analyze({ sh, file, prepared, text = '' }) {
    sh = sh || openSheet({ title: 'מנתח את הארוחה', content: null });
    sh.setTitle('מנתח את הארוחה');
    sh.setContent(spinner('שולחים ל-Gemini, זה לוקח כמה שניות...'));
    let img = prepared;
    try { if (file && !img) img = await prepareImage(file); }
    catch { return showError(sh, 'לא הצלחנו לקרוא את התמונה. אפשר לנסות תמונה אחרת.'); }
    const r = await api('/api/meals/analyze', { method: 'POST', body: { ...(img ? { image: img.image, mime: 'image/jpeg' } : {}), text } });
    if (!r.ok) return showError(sh, ERRORS[r.data && r.data.error] || 'משהו השתבש. אפשר לנסות שוב.', () => analyze({ sh, file, prepared: img, text }));
    showResult(sh, r.data.analysis, { file, img, text });
  }

  function showError(sh, msg, retry) {
    sh.setTitle('לא הצלחנו');
    sh.setContent(h('div', {}, h('p', { class: 'note' }, msg), h('div', { class: 'row-btns' },
      retry ? h('button', { class: 'btn', onclick: retry }, 'ניסיון חוזר') : null,
      h('button', { class: 'btn secondary', onclick: () => sh.close() }, 'סגירה'))));
  }

  function showResult(sh, a, ctx) {
    sh.setTitle('בדיקה לפני שמירה');
    const name = h('input', { class: 'inp', type: 'text', value: a.name, maxlength: '80', 'aria-label': 'שם' });
    const date = h('input', { class: 'inp', type: 'date', value: state.date, max: todayISO(), 'aria-label': 'תאריך' });
    const time = h('input', { class: 'inp', type: 'time', value: state.date === todayISO() ? nowHM() : '12:00', 'aria-label': 'שעה' });
    const fix = h('input', { class: 'inp', type: 'text', placeholder: 'תיקון, למשל: בלי הרוטב', maxlength: '200', 'aria-label': 'תיקון' });
    const reanalyze = (extra) => analyze({ sh, file: ctx.file, prepared: ctx.img, text: [ctx.text, extra].filter(Boolean).join('. ') });
    const t = a.totals;
    const save = h('button', {
      class: 'btn',
      onclick: async (e) => {
        const btn = e.currentTarget; btn.disabled = true;
        const r = await api('/api/meals', {
          method: 'POST',
          body: {
            date: date.value, time: time.value, kind: a.kind, name: name.value, kcal: t.kcal, protein_g: t.protein_g, carbs_g: t.carbs_g, sugar_g: t.sugar_g, fiber_g: t.fiber_g, fat_g: t.fat_g,
            sat_fat_g: t.sat_fat_g, caffeine_mg: a.caffeine_mg, alcohol_g: a.alcohol_g, glycemic_load: a.glycemic_load, items: a.items, confidence: a.confidence,
            source: ctx.img ? 'photo' : 'text', thumb: ctx.img ? ctx.img.thumb : undefined,
          },
        });
        if (r.ok) { toast('נשמר ביומן'); state.date = date.value; sh.close(); await load(); }
        else { toast(r.data && r.data.error === 'bad_input' ? 'השם, התאריך או השעה לא תקינים.' : 'השמירה נכשלה.'); btn.disabled = false; }
      },
    }, 'שמירה ביומן');
    sh.setContent(h('div', {},
      h('label', { class: 'lbl' }, 'שם'), name,
      h('div', { class: 'grid2' }, h('div', {}, h('label', { class: 'lbl' }, 'שעה'), time), h('div', {}, h('label', { class: 'lbl' }, 'תאריך'), date)),
      h('div', { class: 'card' }, ...a.items.map((it) => h('div', { class: 'row' }, h('span', {}, `${it.name} · ${Math.round(it.grams)} גר׳`), h('b', {}, `${it.kcal} קק״ל`)))),
      h('div', { class: 'tags' }, mealTags({ kcal: t.kcal, protein_g: t.protein_g, carbs_g: t.carbs_g, caffeine_mg: a.caffeine_mg, alcohol_g: a.alcohol_g, glycemic_load: a.glycemic_load })),
      h('p', { class: 'note' }, `אמינות ההערכה: ${CONF[a.confidence]}. ${a.note}`),
      ...a.questions.map((q) => h('div', {}, h('p', { class: 'note' }, q.q), h('div', { class: 'chips' }, q.options.map((o) => h('button', { class: 'chip', type: 'button', onclick: () => reanalyze(`${q.q} ${o}`) }, o))))),
      h('label', { class: 'lbl' }, 'משהו לא מדויק?'), fix,
      h('div', { class: 'row-btns' }, h('button', { class: 'btn secondary small', onclick: () => fix.value.trim() && reanalyze(fix.value.trim()) }, 'ניתוח מחדש עם התיקון')),
      save));
  }

  const photoBtn = h('button', { class: 'btn', onclick: async () => { const f = await pickFile(true); if (f) analyze({ file: f }); } }, '📷 צילום ארוחה');
  const galleryBtn = h('button', { class: 'btn secondary', onclick: async () => { const f = await pickFile(false); if (f) analyze({ file: f }); } }, 'בחירה מהגלריה');
  const textBtn = h('button', { class: 'btn secondary small', onclick: () => { const v = textInp.value.trim(); if (v) { textInp.value = ''; analyze({ text: v }); } } }, 'ניתוח');
  textInp.addEventListener('keydown', (e) => { if (e.key === 'Enter') textBtn.click(); });

  root.replaceChildren(
    h('h1', {}, 'יומן אוכל'), h('p', { class: 'sub' }, 'צילום, תיאור בכתב או רישום מהיר'),
    h('section', { class: 'card' }, photoBtn, galleryBtn,
      h('label', { class: 'lbl' }, 'או תיאור בכתב'), h('div', { class: 'row-btns' }, textInp, textBtn),
      h('label', { class: 'lbl' }, 'רישום מהיר'), quickChips(load)),
    box);
  await load();
}
