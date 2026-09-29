// Service worker: קבצי האפליקציה בלבד (בלי נתונים אישיים). רשת קודם, מטמון כגיבוי כשאין חיבור. ה-API אף פעם לא נשמר.
const CACHE = 'sc-shell-v1';
const SHELL = ['/', '/app.css', '/app.js', '/lib.js', '/views/today.js', '/views/food.js', '/views/train.js', '/views/quick.js', '/views/profile.js', '/views/coach.js', '/views/why.js', '/views/insights.js', '/views/nutrition.js', '/manifest.webmanifest', '/icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })   // עוקף את מטמון ה-HTTP של הדפדפן, כדי שגרסה חדשה תגיע
      .then((r) => {
        if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
        return r;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('/')))
  );
});
