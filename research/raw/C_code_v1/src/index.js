import { handle } from './app.js';
import { scheduled } from './cron.js';
export default { fetch: handle, scheduled }; // wrangler.toml: [assets] run_worker_first = ["/api/*"]
