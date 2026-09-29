// פרופיל: כמה פרטים שעוזרים להתאים את התובנות. המידע נשמר בשרת בלבד. המאמן אף פעם לא ממליץ לשנות תרופה.
import { h, api, toast, openSheet } from '../lib.js';

const STATIN_TIMES = [['unknown', 'לא בטוח'], ['morning', 'בוקר'], ['noon', 'צהריים'], ['evening', 'ערב'], ['bedtime', 'לפני השינה']];

export function openProfile(profile = {}, onSaved) {
  const f = (name, attrs = {}) => h('input', { class: 'inp', name, value: profile[name] ?? '', ...attrs });
  const first = f('first_name', { type: 'text', maxlength: '40', placeholder: 'לא חובה' });
  const height = f('height_cm', { type: 'number', inputmode: 'numeric', min: '120', max: '230' });
  const weight = f('weight_kg', { type: 'number', inputmode: 'decimal', min: '35', max: '200', step: '0.1', placeholder: 'לחישוב יעד החלבון' });
  const kcal = f('kcal_target', { type: 'number', inputmode: 'numeric', min: '1200', max: '5000', placeholder: 'ריק = הערכה אוטומטית' });
  const goalSel = h('select', { class: 'sel', 'aria-label': 'מטרה' }, [['muscle_gain', 'בניית שריר (עודף קלוריות מתון)'], ['maintain', 'שמירה על המשקל']].map(([v, l]) => h('option', { value: v, selected: (profile.goal || 'muscle_gain') === v ? true : null }, l)));
  const bed = f('usual_bed', { type: 'time' });
  const wake = f('usual_wake', { type: 'time' });
  const statin = f('statin_name', { type: 'text', maxlength: '60', placeholder: 'כפי שכתוב על האריזה' });
  const dose = f('statin_dose', { type: 'text', maxlength: '30', placeholder: 'למשל 10 מ״ג' });
  const when = h('select', { class: 'sel', 'aria-label': 'מתי נלקח' }, STATIN_TIMES.map(([v, l]) => h('option', { value: v, selected: (profile.statin_time || 'unknown') === v ? true : null }, l)));
  const complaint = h('textarea', { class: 'ta', maxlength: '300', placeholder: 'למשל: מתעורר באמצע הלילה, קשה להירדם, קם עייף' }, profile.complaint || '');
  const save = h('button', {
    class: 'btn',
    onclick: async (e) => {
      const btn = e.currentTarget; btn.disabled = true;
      const num = (v) => (v === '' ? null : Number(v));
      const r = await api('/api/profile', {
        method: 'PUT',
        body: { first_name: first.value, height_cm: num(height.value), goal: goalSel.value, weight_kg: num(weight.value), kcal_target: num(kcal.value), usual_bed: bed.value || null, usual_wake: wake.value || null, statin_name: statin.value, statin_dose: dose.value, statin_time: when.value, complaint: complaint.value },
      });
      if (r.ok) { toast('נשמר'); sh.close(); if (onSaved) await onSaved(r.data.profile); }
      else { toast('בדקו את הערכים ונסו שוב.'); btn.disabled = false; }
    },
  }, 'שמירה');
  const sh = openSheet({
    title: 'הפרופיל שלי',
    content: h('div', {},
      h('p', { class: 'note' }, 'הפרטים האלה משמשים רק להתאמת התובנות ונשארים בשרת. המאמן לא ממליץ לשנות תרופה, ותמיד יפנה לרופא.ה או לרוקח.'),
      h('label', { class: 'lbl' }, 'שם פרטי'), first,
      h('div', { class: 'grid2' }, h('div', {}, h('label', { class: 'lbl' }, 'שעת שינה רגילה'), bed), h('div', {}, h('label', { class: 'lbl' }, 'שעת השכמה רגילה'), wake)),
      h('label', { class: 'lbl' }, 'גובה בס״מ'), height,
      h('label', { class: 'lbl' }, 'מטרה תזונתית'), goalSel,
      h('div', { class: 'grid2' }, h('div', {}, h('label', { class: 'lbl' }, 'משקל בק״ג'), weight), h('div', {}, h('label', { class: 'lbl' }, 'יעד קלוריות ליום'), kcal)),
      h('label', { class: 'lbl' }, 'סטטין: שם התרופה'), statin,
      h('div', { class: 'grid2' }, h('div', {}, h('label', { class: 'lbl' }, 'מינון'), dose), h('div', {}, h('label', { class: 'lbl' }, 'מתי נלקח'), when)),
      h('label', { class: 'lbl' }, 'מה הכי מפריע בשינה?'), complaint,
      save),
  });
}
