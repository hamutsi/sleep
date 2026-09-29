// מאמן שינה: נקודת כניסה. התחברות, ניווט תחתון וטעינת המסכים.
// אין כאן שום נתון אישי בקוד. הכול מגיע מה-API אחרי התחברות.
import { h, api, setUnauthHandler, svgIcon, $, moonIcon } from './lib.js';
import { renderToday } from './views/today.js';
import { renderFood } from './views/food.js';
import { renderTrain } from './views/train.js';
import { renderCoach } from './views/coach.js';

const app = $('#app');
const view = h('div', { id: 'view' });
let nav = null;

const TABS = [
  { id: 'today', label: 'היום', icon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z', render: renderToday },
  { id: 'food', label: 'אוכל', icon: 'M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10', render: renderFood },
  { id: 'train', label: 'אימונים', icon: 'M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12', render: renderTrain },
  { id: 'coach', label: 'מאמן', icon: 'M4 5h16v11H9l-5 4z', render: renderCoach },
];
const currentTab = () => TABS.find((t) => t.id === location.hash.slice(1)) || TABS[0];

function buildNav() {
  if (nav) return;
  nav = h('nav', { class: 'tabs', 'aria-label': 'ניווט' }, h('div', { class: 'in' }, TABS.map((t) => h('a', { href: `#${t.id}`, 'data-tab': t.id }, svgIcon(t.icon), t.label))));
  document.body.append(nav);
}
function dropNav() { if (nav) { nav.remove(); nav = null; } app.classList.remove('has-nav'); }

async function show() {
  const tab = currentTab();
  buildNav();
  app.classList.add('has-nav');
  for (const a of nav.querySelectorAll('a')) a.classList.toggle('on', a.dataset.tab === tab.id);
  app.replaceChildren(view);
  window.scrollTo(0, 0);
  await tab.render(view);
}

/* ---------- מסכי שירות ---------- */
function renderMessage(title, text) {
  dropNav();
  app.replaceChildren(h('section', { class: 'screen center' }, moonIcon(), h('h1', {}, title), h('p', { class: 'sub' }, text),
    h('button', { class: 'btn secondary', onclick: () => boot() }, 'ניסיון חוזר')));
}

function renderLogin(msg = '') {
  dropNav();
  const input = h('input', { class: 'field', type: 'password', id: 'pass', placeholder: 'סיסמה', autocomplete: 'current-password', autocapitalize: 'none', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'go', required: true, 'aria-label': 'סיסמה' });
  const err = h('p', { class: 'err', role: 'alert' }, msg);
  const btn = h('button', { class: 'btn', type: 'submit' }, 'כניסה');
  const form = h('form', {
    class: 'card login',
    onsubmit: async (e) => {
      e.preventDefault();
      btn.disabled = true; err.textContent = '';
      const r = await api('/api/login', { method: 'POST', body: { passphrase: input.value } });
      if (r.ok) return boot();
      err.textContent = r.status === 429 ? `יותר מדי ניסיונות. אפשר לנסות שוב בעוד ${Number(r.data && r.data.retry_after) || 30} שניות.`
        : r.status === 503 ? 'האפליקציה עדיין לא הוגדרה.'
        : r.status === 0 ? 'אין חיבור לאינטרנט.'
        : 'הסיסמה לא נכונה.';
      btn.disabled = false; input.select();
    },
  }, input, err, btn);
  app.replaceChildren(h('section', { class: 'screen center' }, moonIcon(), h('h1', {}, 'מאמן שינה'), h('p', { class: 'sub' }, 'כניסה עם הסיסמה שקיבלת'), form));
  input.focus();
}

async function boot() {
  app.replaceChildren(h('p', { class: 'boot' }, 'טוען...'));
  const r = await api('/api/me');
  if (r.status === 0) return renderMessage('אין חיבור', 'בדקו את החיבור לאינטרנט.');
  if (r.status === 503) return renderMessage('האפליקציה עדיין לא הוגדרה', 'חסרים הגדרות בשרת.');
  if (r.status === 401) return renderLogin();
  return show();
}

setUnauthHandler(() => renderLogin());
window.addEventListener('hashchange', () => { if (nav) show(); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => {});
boot();
