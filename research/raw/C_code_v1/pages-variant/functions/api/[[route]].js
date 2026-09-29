// Pages Functions adapter (only if you stay on Pages). Same handler as the Workers entry in ../../../src/index.js.
import { handle } from '../../../src/app.js';
export const onRequest = ({ request, env }) => handle(request, env);
