// התובנות של היום: כרטיסים שמשתנים כל יום (מבט אחורה, בנתונים שלך, מחקר היום, צעד קטן, סיכום שבוע),
// כפתור "למה ככה?" ליד כל אחד ומשוב קצר שמלמד את המנוע מה לא להציג שוב.
import { h, api, toast, spinner, bidi } from '../lib.js';
import { whyButton } from './why.js';

const STRENGTH = { strong: 'ראיות חזקות', moderate: 'ראיות בינוניות', limited: 'ראיות מוגבלות', method: 'שיטת עבודה' };
const FB = {
  look: [['known', 'כבר ידעתי'], ['irrelevant', 'לא רלוונטי'], ['more', 'עוד כאלה']],
  disc: [['known', 'כבר ידעתי'], ['irrelevant', 'לא רלוונטי'], ['more', 'עוד כאלה']],
  research: [['known', 'כבר ידעתי'], ['irrelevant', 'לא מעניין'], ['more', 'עוד כאלה']],
  move: [['known', 'כבר עושה את זה'], ['irrelevant', 'להחליף מיקוד']],
};
const THANKS = { known: 'נרשם. לא נציג את זה שוב בתקופה הקרובה.', irrelevant: 'נרשם. לא נציג את זה שוב.', more: 'נרשם. נחפש עוד כאלה.' };
const GATE_NOTE = {
  no_connection: 'התובנות מבוססות כרגע על היומן בלבד, כי Google Health עדיין לא מחובר.',
  needs_reauth: 'החיבור ל-Google Health פג, והתובנות מבוססות על היומן ועל הנתונים האחרונים.',
  sync_failed: 'הסנכרון מהשעון לא הצליח כרגע. התובנות מבוססות על הנתונים האחרונים.',
  waiting_for_watch: 'נתוני הלילה עוד לא הגיעו מהשעון. כשיגיעו, התובנות יתעדכנו (אפשר לפתוח את אפליקציית Google Health ולסנכרן).',
  no_sleep_today: 'לא הגיעו נתוני שינה מהשעון היום.',
};

function feedbackRow(card) {
  const opts = FB[card.lane];
  if (!opts) return null;
  let cur = card.feedback || null;
  const row = h('div', { class: 'fb' });
  const paint = () => row.replaceChildren(...opts.map(([action, label]) => h('button', {
    class: `fb-btn${cur === action ? ' on' : ''}`, type: 'button', 'aria-pressed': cur === action ? 'true' : 'false',
    onclick: async () => {
      const next = cur === action ? 'clear' : action;
      const r = await api('/api/insights/feedback', { method: 'POST', body: { id: card.id, action: next } });
      if (!r.ok) { toast('הרישום נכשל. אפשר לנסות שוב.'); return; }
      cur = next === 'clear' ? null : next;
      card.feedback = cur;
      paint();
      if (cur) toast(THANKS[cur]);
    },
  }, label)));
  paint();
  return row;
}

const weeklyGrid = (rows) => h('div', { class: 'wk' }, rows.map((r) => h('div', { class: r.tone === 'good' ? 'g' : r.tone === 'warn' ? 'a' : r.tone === 'bad' ? 'r' : '' }, h('b', {}, r.value), h('span', {}, r.label))));

export function cardEl(c) {
  const strength = c.lane === 'research' && c.data && STRENGTH[c.data.strength];
  return h('section', { class: `card ins ins-${c.lane}${c.lane === 'quiet' ? ' quiet' : ''}${c.lane === 'weekly' ? ' weekly' : ''}`, 'data-key': c.key },
    h('div', { class: 'lane' }, `${c.emoji} ${c.label}`, strength ? h('span', { class: 'badge' }, strength) : null),
    h('h3', {}, bidi(c.title)),
    h('p', {}, bidi(c.body)),
    c.data && c.data.rows ? weeklyGrid(c.data.rows) : null,
    c.topics && c.topics.length || FB[c.lane] ? h('div', { class: 'acts' }, whyButton(c.topics), feedbackRow(c)) : null);
}

async function load(box) {
  const r = await api('/api/insights/today');
  if (!r.ok || !r.data) {
    box.replaceChildren(h('section', { class: 'card' }, h('p', { class: 'note' }, 'לא הצלחנו לטעון את התובנות של היום.'), h('button', { class: 'link', onclick: () => { box.replaceChildren(spinner('טוענים את התובנות...')); load(box); } }, 'ניסיון חוזר')));
    return;
  }
  const { cards, hasSleep, gate } = r.data;
  const note = !hasSleep && GATE_NOTE[gate && gate.state] ? h('p', { class: 'ins-note' }, GATE_NOTE[gate.state]) : null;
  box.replaceChildren(h('h2', {}, 'התובנות של היום'), ...cards.map(cardEl), note);
}

// מחזיר מיד אלמנט עם מחוון טעינה, ומתמלא כשהתובנות מוכנות. הסנכרון מהשעון עלול לקחת כמה שניות, ולכן לא חוסמים את שאר המסך
export function renderInsights() {
  const box = h('div', { class: 'ins-box' }, h('section', { class: 'card' }, spinner('מסנכרנים מהשעון ומכינים את התובנות של היום...')));
  load(box);
  return box;
}
