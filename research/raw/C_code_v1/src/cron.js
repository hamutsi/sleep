import { sendPush } from './push.js';
// Cron runs in UTC only. Trigger every 15 min and decide in Israel local time, so DST changes do not shift reminders.
const hhmm = (ms) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(ms));
export async function scheduled(controller, env) {
  const slots = (env.PUSH_SLOTS || '21:30').split(','); // e.g. "21:30,07:30"; "*" = every run (tests)
  if (!slots.includes('*') && !slots.includes(hhmm(controller.scheduledTime))) return;
  const { results } = await env.DB.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions').all();
  for (const r of results) {
    const status = await sendPush(env, { endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } },
      { web_push: 8030, notification: { title: 'זמן להתכונן לשינה', body: 'שעה עד שעת השינה', navigate: `${env.APP_URL}/` } }, { ttl: 3600, topic: 'bedtime' });
    if (status === 404 || status === 410) await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?1').bind(r.endpoint).run();
  }
}
