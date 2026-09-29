// "למה ככה?": חלון הסבר לכל תובנה. התוכן מגיע מספרייה מאומתת (evidence/library.json), לא מהמודל.
// הקישורים נבדקו אחד אחד מול PubMed, Crossref ו-YouTube. שום בקשה לצד שלישי לא יוצאת עד שלוחצים על קישור.
import { h, openSheet, spinner, ltr, bidi } from '../lib.js';

const STRENGTH = {
  strong: ['ראיות חזקות', 'strong'],
  moderate: ['ראיות בינוניות', 'moderate'],
  limited: ['ראיות מוגבלות', 'limited'],
  method: ['שיטת עבודה', 'method'],
};
const DESIGN = {
  guideline: 'הנחיה קלינית', 'meta-analysis': 'מטא-אנליזה', 'systematic-review': 'סקירה שיטתית', rct: 'ניסוי מבוקר',
  cohort: 'מחקר עוקבה', 'cross-sectional': 'מחקר חתך', review: 'סקירה', 'position-statement': 'עמדת ארגון', label: 'עלון תרופה', other: 'מקור',
};

let cache = null;
export async function loadLibrary() {
  if (cache) return cache;
  try {
    const r = await fetch('/evidence/library.json', { cache: 'no-cache', credentials: 'same-origin' });
    // בגלל ה-fallback של האפליקציה, קובץ חסר מחזיר את דף הבית עם 200. לכן בודקים גם את סוג התוכן
    if (!r.ok || !(r.headers.get('content-type') || '').includes('json')) return null;
    const j = await r.json();
    if (!j || !Array.isArray(j.topics)) return null;
    cache = { builtAt: j.built_at, byId: Object.fromEntries(j.topics.map((t) => [t.id, t])) };
    return cache;
  } catch { return null; }
}

const ext = (href, cls, ...kids) => h('a', { href, class: cls, target: '_blank', rel: 'noopener noreferrer' }, ...kids);

const sourceRow = (s) => ext(s.url, 'why-link',
  h('b', { class: 'why-ttl' }, ltr(s.title)),
  h('span', { class: 'why-meta' }, `${s.authors_short} · ${s.venue} · ${s.year} · ${DESIGN[s.design] || 'מקור'}${s.peer_reviewed === false ? ' · לא עבר ביקורת עמיתים' : ''}`),
  h('span', { class: 'why-fnd' }, ltr(s.key_finding_en)));

const videoRow = (v) => ext(v.url, 'why-link why-vid',
  h('b', { class: 'why-ttl' }, ltr(`▶ ${v.title}`)),
  h('span', { class: 'why-meta' }, `${v.channel} · ${v.lang === 'he' ? 'בעברית' : 'באנגלית'}`),
  h('span', { class: 'why-fnd' }, bidi(v.note_he)),
  v.caveat_he ? h('span', { class: 'why-cav' }, bidi(v.caveat_he)) : null);

function topicBody(t) {
  const [label, cls] = STRENGTH[t.strength] || STRENGTH.limited;
  const sec = (title, text, extra = '') => h('div', { class: `why-sec ${extra}` }, h('h4', {}, title), h('p', {}, bidi(text)));
  return h('div', { class: 'why' },
    h('div', { class: 'why-head' }, h('span', { class: `why-badge s-${cls}` }, label), h('span', { class: 'why-sn' }, bidi(t.strength_note_he))),
    h('p', { class: 'why-sum' }, bidi(t.summary_he)),
    sec('עד כמה זה רלוונטי לגבר בגיל 47', t.applies_to_he),
    sec('מה זה לא אומר', t.not_mean_he, 'warn'),
    h('div', { class: 'why-sec' }, h('h4', {}, 'למי שרוצה להעמיק'),
      ...t.sources.map(sourceRow),
      ...(t.videos.length ? [h('h4', { class: 'why-h2' }, 'הסברים בווידאו'), ...t.videos.map(videoRow)] : [])));
}

// פותח חלון עם נושא אחד, או כמה נושאים כרשימה מתקפלת (הראשון פתוח)
export async function openWhy(topicIds, { title = 'למה ככה?' } = {}) {
  const sh = openSheet({ title, content: spinner('טוען את המקורות...') });
  const lib = await loadLibrary();
  const topics = lib ? [...new Set(topicIds || [])].map((id) => lib.byId[id]).filter(Boolean) : [];
  if (!topics.length) {
    sh.setContent(h('div', {}, h('p', { class: 'note' }, lib ? 'עוד אין הסבר מפורט לנושא הזה.' : 'לא הצלחנו לטעון את המקורות. אפשר לנסות שוב בעוד רגע.'),
      h('button', { class: 'btn secondary', onclick: () => sh.close() }, 'סגירה')));
    return;
  }
  const foot = h('p', { class: 'note' }, 'כל קישור נבדק מול PubMed או YouTube', lib.builtAt ? [' (ספרייה מ-', ltr(lib.builtAt), ')'] : '', '. מחקר על קבוצה אחרת לא בהכרח חל עליך, וההסבר אינו ייעוץ רפואי.');
  const close = h('button', { class: 'btn secondary', onclick: () => sh.close() }, 'סגירה');
  if (topics.length === 1) { sh.setTitle(bidi(topics[0].title_he)); sh.setContent(h('div', {}, topicBody(topics[0]), foot, close)); return; }
  sh.setContent(h('div', {}, ...topics.map((t, i) => h('details', { class: 'why-det', ...(i === 0 ? { open: true } : {}) }, h('summary', {}, bidi(t.title_he)), topicBody(t))), foot, close));
}

export const whyButton = (topicIds, label = 'למה ככה?') =>
  (topicIds && topicIds.length ? h('button', { class: 'why-btn', type: 'button', onclick: () => openWhy(topicIds) }, label) : null);

// ספריית המחקרים כולה, לעיון חופשי ולחיפוש. נושאים רפואיים (תרופות, תוספים) נגישים רק מכאן או משאלה למאמן, ולא מוצגים כתובנה יומית
export async function openLibrary() {
  const sh = openSheet({ title: 'ספריית המחקרים', content: spinner('טוען...') });
  const lib = await loadLibrary();
  if (!lib) { sh.setContent(h('p', { class: 'note' }, 'לא הצלחנו לטעון את הספרייה. אפשר לנסות שוב בעוד רגע.')); return; }
  const topics = Object.values(lib.byId).sort((a, b) => a.title_he.localeCompare(b.title_he, 'he'));
  const input = h('input', { class: 'inp', type: 'search', placeholder: 'חיפוש נושא (קפה, אלכוהול, סטטין, אימון...)', 'aria-label': 'חיפוש בספרייה' });
  const list = h('div');
  const paint = () => {
    const q = input.value.trim();
    const hits = topics.filter((t) => !q || `${t.title_he} ${t.summary_he} ${(t.tags || []).join(' ')}`.includes(q));
    list.replaceChildren(...(hits.length ? hits.map((t) => h('button', { class: 'hist', type: 'button', onclick: () => openWhy([t.id]) }, h('b', {}, t.title_he), h('span', {}, (STRENGTH[t.strength] || STRENGTH.limited)[0])))
      : [h('p', { class: 'empty' }, 'לא נמצא נושא כזה.')]));
  };
  input.addEventListener('input', paint);
  paint();
  sh.setContent(h('div', {}, h('p', { class: 'note' }, `${topics.length} נושאים. כל קישור נבדק מול PubMed או YouTube. הסבר בשפה פשוטה, לא ייעוץ רפואי.`), input, list,
    h('button', { class: 'btn secondary', onclick: () => sh.close() }, 'סגירה')));
}
