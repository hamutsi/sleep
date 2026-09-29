// רישום מהיר של קפה, תה, פרה-וורקאוט, אלכוהול ונשנוש. קפאין ואלכוהול הם הגורמים הבולטים ביותר בשינה, ולכן הרישום חייב להיות של שתי לחיצות.
import { h, api, toast, openSheet, todayISO, nowHM } from '../lib.js';

export const QUICK = [
  ['coffee', '☕', 'קפה', 'amount'], ['tea', '🫖', 'תה', 'amount'], ['preworkout', '⚡', 'פרה-וורקאוט', 'amount'],
  ['wine', '🍷', 'כוס יין', 'amount'], ['beer', '🍺', 'בירה', 'amount'], ['spirits', '🥃', 'משקה חריף', 'amount'], ['snack', '🍪', 'נשנוש', ''],
];

export function quickChips(onDone, date = todayISO()) {
  return h('div', { class: 'chips' }, QUICK.map(([kind, emoji, label, amount]) =>
    h('button', { class: 'chip', type: 'button', onclick: () => quickSheet({ kind, emoji, label, amount, date, onDone }) }, `${emoji} ${label}`)));
}

export function quickSheet({ kind, emoji, label, amount, date, onDone }) {
  let count = 1;
  const time = h('input', { class: 'inp', type: 'time', value: nowHM(), 'aria-label': 'שעה' });
  const day = h('input', { class: 'inp', type: 'date', value: date, max: todayISO(), 'aria-label': 'תאריך' });
  const counts = h('div', { class: 'chips' });
  const paint = () => counts.replaceChildren(...[1, 2, 3].map((n) => h('button', { class: `chip${n === count ? ' on' : ''}`, type: 'button', onclick: () => { count = n; paint(); } }, n === 1 ? 'אחד' : `${n}`)));
  paint();
  const save = h('button', {
    class: 'btn',
    onclick: async (e) => {
      const btn = e.currentTarget; btn.disabled = true;
      const r = await api('/api/quick', { method: 'POST', body: { kind, date: day.value, time: time.value, count } });
      if (r.ok) { toast(`נרשם: ${label}`); sh.close(); if (onDone) await onDone(); }
      else { toast(r.data && r.data.error === 'bad_input' ? 'התאריך או השעה לא תקינים.' : 'הרישום נכשל.'); btn.disabled = false; }
    },
  }, 'רישום');
  const sh = openSheet({
    title: `${emoji} ${label}`,
    content: h('div', {},
      h('div', { class: 'grid2' }, h('div', {}, h('label', { class: 'lbl' }, 'שעה'), time), h('div', {}, h('label', { class: 'lbl' }, 'תאריך'), day)),
      amount ? h('div', {}, h('label', { class: 'lbl' }, 'כמה'), counts) : null,
      save),
  });
}
