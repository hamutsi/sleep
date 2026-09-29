// יומן אימונים: סוג, שעת התחלה, משך ומאמץ (1 עד 10). שעת האימון ועוצמתו הם מהגורמים החזקים לשינה, לכן שעת ההתחלה חשובה.
import { h, api, toast, ltr, todayISO, nowHM, fmtDate } from '../lib.js';

const TYPES = [['weights', 'משקולות'], ['cardio', 'אירובי'], ['walk', 'הליכה'], ['other', 'אחר']];
const TYPE_LABEL = Object.fromEntries(TYPES);

export async function renderTrain(root) {
  let type = 'weights';
  let rpe = 6;
  const date = h('input', { class: 'inp', type: 'date', value: todayISO(), max: todayISO(), 'aria-label': 'תאריך' });
  const time = h('input', { class: 'inp', type: 'time', value: nowHM(), 'aria-label': 'שעת התחלה' });
  const dur = h('input', { class: 'inp', type: 'number', inputmode: 'numeric', min: '5', max: '600', value: '45', 'aria-label': 'משך בדקות' });
  const note = h('input', { class: 'inp', type: 'text', maxlength: '300', placeholder: 'למשל: רגליים, או ריצה קלה', 'aria-label': 'הערה' });
  const typeBox = h('div', { class: 'chips' });
  const rpeBox = h('div', { class: 'chips' });
  const list = h('div');

  const paint = () => {
    typeBox.replaceChildren(...TYPES.map(([k, label]) => h('button', { class: `chip${k === type ? ' on' : ''}`, type: 'button', onclick: () => { type = k; paint(); } }, label)));
    rpeBox.replaceChildren(...Array.from({ length: 10 }, (_, i) => i + 1).map((n) => h('button', { class: `chip${n === rpe ? ' on' : ''}`, type: 'button', 'aria-label': `מאמץ ${n}`, onclick: () => { rpe = n; paint(); } }, String(n))));
  };
  paint();

  async function load() {
    const r = await api('/api/workouts?days=21');
    const rows = r.ok ? r.data.workouts : [];
    list.replaceChildren(h('section', { class: 'card' }, h('h2', {}, 'שלושת השבועות האחרונים'),
      ...(rows.length ? rows.map((w) => h('div', { class: 'item' },
        h('div', { class: 'ico' }, w.type === 'weights' ? '🏋️' : w.type === 'walk' ? '🚶' : w.type === 'cardio' ? '🏃' : '💪'),
        h('div', { class: 'grow' }, h('div', { class: 't' }, `${fmtDate(w.local_date)} · `, ltr(w.local_time)), h('div', { class: 'n' }, `${TYPE_LABEL[w.type] || w.type} · ${w.duration_min} דק׳`),
          h('div', { class: 'tags' }, w.rpe ? h('span', { class: 'tg' }, `מאמץ ${w.rpe} מתוך 10`) : null, w.note ? h('span', { class: 'tg' }, w.note) : null)),
        h('button', { class: 'x', 'aria-label': 'מחיקה', onclick: async () => { if (!confirm('למחוק את האימון?')) return; const x = await api(`/api/workouts/${w.id}`, { method: 'DELETE' }); if (x.ok) { toast('נמחק'); load(); } } }, '×')))
        : [h('p', { class: 'empty' }, 'עוד אין אימונים ביומן.')])));
  }

  const save = h('button', {
    class: 'btn',
    onclick: async (e) => {
      const btn = e.currentTarget; btn.disabled = true;
      const r = await api('/api/workouts', { method: 'POST', body: { date: date.value, time: time.value, duration_min: Number(dur.value), type, rpe, note: note.value } });
      if (r.ok) { toast('האימון נשמר'); note.value = ''; await load(); }
      else toast(r.data && r.data.error === 'bad_input' ? `בדקו את השדה: ${({ duration_min: 'משך', date: 'תאריך', time: 'שעה', rpe: 'מאמץ', type: 'סוג' })[r.data.field] || r.data.field}.` : 'השמירה נכשלה.');
      btn.disabled = false;
    },
  }, 'שמירת אימון');

  root.replaceChildren(
    h('h1', {}, 'יומן אימונים'), h('p', { class: 'sub' }, 'שעה, משך ומאמץ. הם נכנסים לניתוח השינה.'),
    h('section', { class: 'card' },
      h('label', { class: 'lbl' }, 'סוג'), typeBox,
      h('div', { class: 'grid2' }, h('div', {}, h('label', { class: 'lbl' }, 'שעת התחלה'), time), h('div', {}, h('label', { class: 'lbl' }, 'תאריך'), date)),
      h('label', { class: 'lbl' }, 'משך בדקות'), dur,
      h('label', { class: 'lbl' }, 'מאמץ (1 קל מאוד, 10 מקסימלי)'), rpeBox,
      h('label', { class: 'lbl' }, 'הערה'), note, save),
    list);
  await load();
}
