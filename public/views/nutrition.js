// תזונה יומית מול יעדים: חלבון (עם "כמה חסר"), קלוריות, פחמימות, שומן, שומן רווי, סוכרים וסיבים.
// היעדים הם ברירת מחדל למתאמן, מחושבים בשרת (src/nutrition.js) ואפשר לעדכן בפרופיל. זה לא ייעוץ תזונתי, וההערכה מתמונה גסה.
import { h } from '../lib.js';

const ROWS = [
  ['protein_g', 'חלבון', 'גר׳'], ['kcal', 'אנרגיה', 'קק״ל'], ['carbs_g', 'פחמימות', 'גר׳'], ['fat_g', 'שומן', 'גר׳'],
  ['sat_fat_g', 'שומן רווי', 'גר׳'], ['sugar_g', 'סוכרים (כולל טבעיים)', 'גר׳'], ['fiber_g', 'סיבים', 'גר׳'],
];
const num = (v) => Number(v).toLocaleString('he-IL');

function row(key, label, unit, val, t) {
  const pct = Math.min(100, Math.round((val / t.goal) * 100));
  const over = t.kind === 'max' && val > t.goal;
  const goalTxt = t.kind === 'max' ? `עד ${num(t.goal)}` : t.kind === 'guide' ? `כ-${num(t.goal)}` : num(t.goal);
  let sub = '';
  if (key === 'protein_g') sub = val >= t.goal ? 'יעד החלבון להיום הושג' : `חסרים ${num(t.goal - val)} גר׳ חלבון ליעד`;
  else if (t.kind === 'min') sub = val >= t.goal ? 'היעד הושג' : `חסרים ${num(t.goal - val)} ליעד`;
  else if (over) sub = `${num(val - t.goal)} מעל הגבול המומלץ`;
  const bar = h('div', { class: `nbar ${t.kind}${over ? ' over' : ''}`, role: 'progressbar', 'aria-valuenow': String(val), 'aria-valuemax': String(t.goal), 'aria-label': label }, h('i'));
  bar.firstChild.style.setProperty('--w', `${pct}%`);
  return h('div', { class: `nrow${key === 'protein_g' ? ' main' : ''}` },
    h('div', { class: 'nhead' }, h('b', {}, label), h('span', { class: 'ltr' }, `${num(val)} / ${goalTxt} ${unit}`)), bar, sub ? h('div', { class: 'nsub' }, sub) : null);
}

export function nutritionCard(day) {
  const t = day.targets, tot = day.totals;
  if (!t || !tot) return null;
  const notes = [];
  if (t.weight_assumed || t.kcal_assumed) notes.push(`היעדים מחושבים לפי ${t.weight_kg} ק״ג${t.kcal_assumed ? ' ואנרגיה משוערת' : ''}. אפשר לעדכן בפרופיל.`);
  if (t.goal === 'muscle_gain' && t.kcal_assumed) notes.push('המטרה היא בניית שריר: היעד כולל עודף מתון של כ-250 קק״ל, ופחמימות מתונות (כ-40%) כדי לתמוך גם בסוכר.');
  notes.push('יעדי התייחסות כלליים למתאמן (חלבון 1.8 גר׳ לק״ג), לא ייעוץ תזונתי. הערכת ארוחה מתמונה גסה, ולכן המספרים הם כיוון.');
  return h('section', { class: 'card' }, h('h2', {}, 'תזונה מול היעדים'),
    ...ROWS.map(([k, label, unit]) => row(k, label, unit, tot[k] ?? 0, t[k])), h('p', { class: 'note' }, notes.join(' ')));
}

export function proteinLine(day) {
  const t = day.targets, tot = day.totals;
  if (!t || !tot) return null;
  const miss = t.protein_g.goal - (tot.protein_g || 0);
  return h('div', { class: 'row' }, h('span', {}, 'חלבון היום'), h('b', {}, miss > 0 ? `${num(tot.protein_g || 0)} מתוך ${num(t.protein_g.goal)} גר׳, חסרים ${num(miss)}` : `${num(tot.protein_g)} גר׳, היעד הושג`));
}
