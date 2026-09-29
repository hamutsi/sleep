import { handle } from './app.js';
import { scheduled } from './cron.js';
import { rfc8291, sealProbe, tseProbe } from './test-routes.js';
export default {
  async fetch(req, env) {
    const p = new URL(req.url).pathname;
    if (p === '/__rfc8291') return rfc8291();
    if (p === '/__seal') return sealProbe();
    if (p === '/__tse') return tseProbe();
    return p.startsWith('/api/') ? handle(req, env) : env.ASSETS.fetch(req);
  },
  async scheduled(c, env, ctx) { try { await scheduled(c, env, ctx); } catch (e) { console.log('SCHEDULED ERR', e && (e.stack || e.message || String(e))); throw e; } },
};
