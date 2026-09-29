// המאמן: שיחה יומית אחת, שנפתחת רק אחרי שער עדכניות (סנכרון מהשעון וחישוב מחדש), עם כלים שמביאים נתונים עדכניים בכל הודעה.
// כללי המאמן והבטיחות מבוססים על דוחות המחקר B1, B2 ו-B3 (research/raw). הכללים כאן הם חלק ממה שנבדק בבדיקות.
import { json } from './http.js';
import { V, BadInput } from './validate.js';
import { localDate, addDays, now } from './util.js';
import { coachChat, generateOpener, GeminiError, keyCheck, usd } from './gemini.js';
import { nightsSummary, sleepStats, dayLog, getProfile } from './data.js';
import { coachDate, freshnessGate } from './freshness.js';
import { guardReply, redFlag } from './safety.js';
import { nowLocal } from './logs.js';
import { LIBRARY, CATALOG_IDS, getStack } from './insights_api.js';
import { nutritionTargets } from './nutrition.js';

const MAX_HISTORY = 16;
const uuid = () => crypto.randomUUID();


export { coachDate };   // נשאר מיוצא מכאן כי בדיקות ומודולים אחרים מייבאים אותו משם

// המאמן שולח נתוני בריאות ל-Gemini, ולכן לא מופעל עד שהבעלים מצהיר על שכבת המפתח: paid (מומלץ) או free (מודע להשלכה).
export const coachEnabled = (env) => !!env.GEMINI_API_KEY && ['paid', 'free'].includes(env.GEMINI_TIER);

/* ---------- כלים למודל ---------- */
export const COACH_TOOLS = [
  { name: 'get_nights', description: 'מחזיר סיכום של הלילות האחרונים: שעות הירדמות והשכמה, דקות שינה, דופק מנוחה, HRV ונשימות. להשתמש כשצריך נתונים מעבר למה שכבר מופיע בהקשר.',
    parametersJsonSchema: { type: 'object', properties: { days: { type: 'integer', minimum: 1, maximum: 30, description: 'כמה לילות אחורה' } }, required: ['days'] } },
  { name: 'get_day', description: 'מחזיר את היומן של יום מסוים: ארוחות, קפה ואלכוהול, אימונים ובדיקת בוקר.',
    parametersJsonSchema: { type: 'object', properties: { date: { type: 'string', description: 'YYYY-MM-DD' } }, required: ['date'] } },
  { name: 'get_workouts', description: 'מחזיר את האימונים בימים האחרונים: סוג, שעת התחלה, משך ומאמץ.',
    parametersJsonSchema: { type: 'object', properties: { days: { type: 'integer', minimum: 1, maximum: 30 } }, required: ['days'] } },
  { name: 'get_profile', description: 'מחזיר את הפרופיל: שעות שינה והשכמה רגילות, סטטין, גובה ומה מפריע בשינה.', parametersJsonSchema: { type: 'object', properties: {} } },
];

export const makeExec = (env) => ({
  get_nights: async ({ days }) => { const n = await nightsSummary(env, Math.min(30, Math.max(1, Number(days) || 7))); return { nights: n, stats: sleepStats(n) }; },
  get_day: async ({ date }) => dayLog(env, V.date(date, 'date')),
  get_workouts: async ({ days }) => {
    const d = Math.min(30, Math.max(1, Number(days) || 7));
    const r = await env.DB.prepare('SELECT local_date, local_time, type, duration_min, rpe FROM workout WHERE local_date >= ?1 ORDER BY ts_start DESC').bind(addDays(localDate(), -d)).all();
    return { workouts: r.results || [] };
  },
  get_profile: async () => getProfile(env),
});

/* ---------- ההנחיה למודל ---------- */
export const COACH_RULES = `אתה מאמן שינה אישי ללקוח אחד, דרך אפליקציה. אתה מדבר עברית טבעית, קצרה וחמה, בלשון ניטרלית מגדרית (רבים, שם פעולה או "אפשר"). בלי מקף ארוך.

מי המשתמש: גבר, בן 47, רזה, מתאמן ארבע פעמים בשבוע (כוח ואירובי). כולסטרול גבוה שמטופל בסטטין, וטרום סוכרת. הפרטים המדויקים בנתונים למטה.

עקרונות מקצועיים (מבוססי מחקר שנבדק):
- סדירות לפני משך. שעות הירדמות והשכמה קבועות הן המנוף החשוב ביותר בטרום סוכרת. סטיית תקן של השעות עד 30 דקות טובה, מעל 60 דקות אדומה. משך: ממוצע שבועי של 7 שעות ומעלה, ומדידת שעון של 6.5 עד 7 נחשבת קרוב ליעד.
- אין ציון יומי ואין השוואה לאוכלוסייה. מסתכלים על מגמה של שבוע ומעלה מול הרגיל של המשתמש עצמו. לילה בודד הוא רעש.
- שלבי שינה (עמוקה, REM) לא מדויקים בלילה בודד, ולכן לא מאמנים עליהם ולא מציינים דקות של שינה עמוקה. HRV רק ביחס לטווח האישי ולממוצע של כמה ימים. דופק מנוחה ונשימות אמינים יותר.
- לפני שקוראים ללילה גרוע, בודקים הסברים ביומן בסדר הזה: אלכוהול, אימון קשה שהסתיים פחות מ-4 שעות לפני השינה, קפאין מאוחר (הסף תלוי במינון, ברירת מחדל 9 שעות לפני השינה), ארוחה פחות מ-3 שעות לפני השינה, חום בחדר, מחלה או נסיעה.
- שינוי אחד בכל פעם. אם מציעים משהו, מציעים דבר אחד קטן ומדיד, ולא רשימה.
- אם משהו עובד, אומרים את זה. חיזוק שווה יותר מעוד תיקון.
- כנות: אומרים כשאין מספיק נתונים, ומבחינים בין קשר להוכחה. לא ממציאים מספרים. אם אין נתון, אומרים שאין.

כללי בטיחות (מחייבים):
- לעולם לא מייעצים להתחיל, להפסיק, לדלג, לחצות, להחליף או להזיז שעה של תרופה כלשהי, כולל הסטטין. שאלה כזו מקבלת הפניה לרופא.ה או לרוקח.
- אין אבחנות. לא אומרים "יש לך דום נשימה", "סוכרת" או "נדודי שינה". מותר לומר "הסימנים האלה שווה לבדוק עם רופא.ה, למשל בבדיקת שינה".
- הסטטין אינו הסבר ברירת מחדל לשינה גרועה: מחקרים כפולי סמיות לא מצאו קשר סיבתי להפרעות שינה. לא מאשימים אותו ולא מנקים אותו. אם המשתמש חושד, מציעים לתעד מתי זה התחיל ולהעלות עם הרופא.ה.
- לא מציעים תוספים. אם המשתמש מזכיר תוסף (מלטונין, מגנזיום, אורז אדום, ניאצין ועוד), אומרים שכדאי לבדוק עם רוקח, בגלל הסטטין וטרום הסוכרת.
- לא מבטיחים שיפור בכולסטרול או בסוכר בעקבות שינה טובה יותר.
- נחירות, נשימות בשינה או ישנוניות ביום: מפנים לרופא.ה, ולעולם לא על סמך נתוני חמצן מהשעון.
- ערכי בדיקות דם נקראים לפי הטווח שהמעבדה הדפיסה.

עבודה עם הנתונים:
- יש לך כלים שמביאים נתונים עדכניים. קוראים להם במקום לנחש, ותמיד מציינים לפי איזה נתון ומתי.
- תזונה: ב-nutrition_today יש מה נאכל היום ויעדי התייחסות (חלבון 1.8 גר׳ לק״ג למתאמן). אפשר לומר כמה חלבון חסר, בלי לשפוט ובלי לתת דיאטה. ההערכות מתמונה גסות. שעה מוקדמת ביום היא סיבה טבעית לפער.\n- התשובות קצרות: שתיים עד ארבע שורות בדרך כלל. שאלה אחת בסוף, רק אם היא מקדמת.`;

async function buildContext(env, cdate, gate) {
  const [profile, nights, today, yesterday, stack] = await Promise.all([
    getProfile(env), nightsSummary(env, 14), dayLog(env, cdate), dayLog(env, addDays(cdate, -1)),
    getStack(env, cdate, gate && gate.state !== 'running' ? gate : null).catch((e) => { console.error('insights failed', e && e.message); return null; }),   // תקלה בתובנות לא מפילה את המאמן
  ]);
  const cur = nowLocal();
  return {
    now_local: `${cur.date} ${cur.time}`, coach_date: cdate, freshness: gate || null, profile, stats: sleepStats(nights), nights: nights.slice(0, 7), log_today: today, log_yesterday: yesterday,
    nutrition_today: (() => { const sum = (k) => Math.round(today.meals.reduce((a, m) => a + (m[k] || 0), 0)); return { eaten_so_far: { kcal: sum('kcal'), protein_g: sum('protein_g'), carbs_g: sum('carbs_g'), fat_g: sum('fat_g'), sat_fat_g: sum('sat_fat_g'), sugar_g: sum('sugar_g'), fiber_g: sum('fiber_g') }, targets: nutritionTargets(profile) }; })(),
    insights_today: stack ? stack.cards.map((c) => ({ lane: c.label, title: c.title, text: c.body, topics: c.topics })) : [],
  };
}

// קטלוג הנושאים שיש להם הסבר מאומת בכפתור "למה ככה?". המודל מצטט מזהים בלבד, והאפליקציה מציגה את המקורות מהספרייה
export const WHY_RE = /\[\[\s*(?:למה|why)\s*:\s*([^\]]*?)\s*\]\]/gi;
export function extractWhy(text, valid = CATALOG_IDS) {
  const ids = [];
  const clean = String(text).replace(WHY_RE, (_, list) => { for (const id of list.split(/[,\s]+/)) if (valid.has(id) && !ids.includes(id)) ids.push(id); return ''; })
    .replace(/[ \t]{2,}/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return { text: clean, topics: ids.slice(0, 3) };
}
const topicsBlock = () => (LIBRARY.length
  ? `\n\nנושאי מחקר שיש להם הסבר מפורט עם מקורות מאומתים בכפתור "למה ככה?" (מזהה: נושא):\n${LIBRARY.map((t) => `${t.id}: ${t.title}`).join('\n')}\nכשתשובה נשענת על אחד מהנושאים האלה, מסיימים אותה בשורה נפרדת בפורמט [[למה: מזהה1, מזהה2]], עד שלושה מזהים מהרשימה בלבד. לעולם לא כותבים קישורים, שמות של מחקרים או מספרים מהספרות: האפליקציה מציגה בעצמה את המקורות המאומתים. אם אין נושא מתאים, לא מוסיפים את השורה.\nבהקשר יש insights_today: התובנות שהאפליקציה כבר הציגה היום. לא חוזרים עליהן מילה במילה. אפשר להרחיב על אחת מהן, לענות על שאלה עליה, או לבחור נושא אחר.`
  : '');
const systemFor = (ctx) => `${COACH_RULES}${topicsBlock()}\n\n===== נתונים (נכון לרגע השיחה) =====\n${JSON.stringify(ctx)}`;

/* ---------- נקודות קצה ---------- */
const jsonBody = async (request) => { const b = await request.json().catch(() => null); return b && typeof b === 'object' && !Array.isArray(b) ? b : {}; };
const fail = (e) => { if (e instanceof GeminiError) return json({ error: e.code }, e.status); throw e; };
const disabled = (env) => json({ error: 'coach_disabled', tier: env.GEMINI_TIER || null, hasKey: !!env.GEMINI_API_KEY }, 403);

async function ensureThread(env, cdate) {
  await env.DB.prepare('INSERT OR IGNORE INTO chat_thread (id, coach_date, created_at) VALUES (?1, ?2, ?3)').bind(uuid(), cdate, now()).run();
  return env.DB.prepare('SELECT * FROM chat_thread WHERE coach_date = ?1').bind(cdate).first();
}

const parseMeta = (r) => { let meta = null; try { meta = r.meta_json ? JSON.parse(r.meta_json) : null; } catch { /* ריק */ } return { id: r.id, role: r.role, text: r.text, created_at: r.created_at, meta }; };
async function threadPayload(env, th) {
  const r = await env.DB.prepare('SELECT id, role, text, meta_json, created_at FROM chat_message WHERE thread_id = ?1 ORDER BY created_at, rowid').bind(th.id).all();
  return { thread: { id: th.id, coach_date: th.coach_date, opener_status: th.opener_status }, messages: (r.results || []).map(parseMeta) };
}
const addMessage = async (env, threadId, role, text, meta) => {
  const id = uuid();
  await env.DB.prepare('INSERT INTO chat_message (id, thread_id, role, text, meta_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(id, threadId, role, text, meta ? JSON.stringify(meta) : null, now()).run();
  return id;
};

export async function coachSelftest(env) {
  return json(await keyCheck(env));
}

export async function coachStatus(env) {
  const used = await env.DB.prepare('SELECT calls FROM gemini_usage WHERE local_date = ?1').bind(localDate()).first();
  const m = await env.DB.prepare('SELECT COALESCE(SUM(calls),0) AS calls, COALESCE(SUM(tokens_in),0) AS tin, COALESCE(SUM(tokens_out),0) AS tout FROM gemini_usage WHERE local_date >= ?1').bind(addDays(localDate(), -29)).first();
  return json({ enabled: coachEnabled(env), tier: env.GEMINI_TIER || null, hasKey: !!env.GEMINI_API_KEY, dailyCap: Number(env.GEMINI_DAILY_CAP) || 120, usedToday: (used && used.calls) || 0, coachDate: coachDate(),
    usage30: { calls: m.calls, tokens_in: m.tin, tokens_out: m.tout, usd: usd(m.tin, m.tout) } });
}

export async function coachStart(request, env) {
  if (!coachEnabled(env)) return disabled(env);
  const force = !!(await jsonBody(request)).force;
  const cdate = coachDate();
  let th = await ensureThread(env, cdate);
  if (th.opener_status === 'done') return json({ ...(await threadPayload(env, th)), gate: JSON.parse(th.gate_json || 'null') });
  if (th.opener_status === 'running' && now() - (th.opener_started_at || 0) < 90) return json({ ...(await threadPayload(env, th)), gate: { state: 'running' } }, 202);

  const gate = await freshnessGate(env, cdate);
  if (gate.state === 'waiting_for_watch' && !force) return json({ ...(await threadPayload(env, th)), gate });

  // נעילה: רק בקשה אחת יוצרת את הפתיחה, גם אם שני מכשירים נפתחו באותו רגע
  const lock = await env.DB.prepare(
    `UPDATE chat_thread SET opener_status = 'running', opener_started_at = ?1, gate_json = ?2
     WHERE id = ?3 AND (opener_status = 'none' OR (opener_status = 'running' AND opener_started_at < ?4))`).bind(now(), JSON.stringify(gate), th.id, now() - 90).run();
  if (!lock.meta.changes) { th = await ensureThread(env, cdate); return json({ ...(await threadPayload(env, th)), gate: { state: 'running' } }, 202); }

  try {
    const ctx = await buildContext(env, cdate, gate);
    const prompt = `פתחו את היום בהודעה של שניים עד ארבעה משפטים: מה בולט בלילה האחרון ובהקשר של אתמול (רק מה שבנתונים, בלי ציון ובלי דקות של שינה עמוקה), נושא אחד שכדאי לדבר עליו היום, ושאלה קצרה. ${gate.sleepForToday ? '' : 'נתוני הלילה של היום עוד לא הגיעו מהשעון, וצריך לומר זאת בפתיחה ולא לנחש. '}החזירו גם עד שלוש תשובות קצרות שאפשר ללחוץ עליהן.`;
    const op = await generateOpener(env, { system: systemFor(ctx), prompt, topicIds: LIBRARY.map((t) => t.id) });
    const w = extractWhy(op.text);
    const g = guardReply(w.text);
    const topics = [...new Set([...(op.topics || []), ...w.topics])].filter((id) => CATALOG_IDS.has(id)).slice(0, 3);
    await addMessage(env, th.id, 'assistant', g.text, { opener: true, quick_replies: op.quick_replies, topics, gate, as_of: ctx.now_local, flags: g.flags });
    await env.DB.prepare("UPDATE chat_thread SET opener_status = 'done' WHERE id = ?1").bind(th.id).run();
  } catch (e) {
    await env.DB.prepare("UPDATE chat_thread SET opener_status = 'none' WHERE id = ?1").bind(th.id).run();   // מאפשר ניסיון חוזר
    return fail(e);
  }
  th = await ensureThread(env, cdate);
  return json({ ...(await threadPayload(env, th)), gate });
}

export async function coachMessage(request, env) {
  if (!coachEnabled(env)) return disabled(env);
  const text = V.str((await jsonBody(request)).text, 1000, 'text', { required: true });
  const cdate = coachDate();
  const th = await ensureThread(env, cdate);
  const userId = await addMessage(env, th.id, 'user', text);

  const flag = redFlag(text);
  if (flag) {
    const id = await addMessage(env, th.id, 'assistant', flag.text, { red_flag: flag.kind });
    return json({ message: { id, role: 'assistant', text: flag.text, meta: { red_flag: flag.kind } } });
  }
  try {
    const hist = (await env.DB.prepare('SELECT role, text FROM chat_message WHERE thread_id = ?1 ORDER BY created_at DESC, rowid DESC LIMIT ?2').bind(th.id, MAX_HISTORY).all()).results.reverse();
    const gate = JSON.parse(th.gate_json || 'null');
    const ctx = await buildContext(env, cdate, gate);
    const r = await coachChat(env, { system: systemFor(ctx), history: hist, tools: COACH_TOOLS, exec: makeExec(env) });
    const w = extractWhy(r.text);
    const g = guardReply(w.text);
    const meta = { flags: g.flags, tool_steps: r.steps, as_of: ctx.now_local, topics: w.topics };
    const id = await addMessage(env, th.id, 'assistant', g.text, meta);
    return json({ message: { id, role: 'assistant', text: g.text, meta } });
  } catch (e) {
    await env.DB.prepare('DELETE FROM chat_message WHERE id = ?1').bind(userId).run();   // כדי שניסיון חוזר לא ישכפל את ההודעה
    return fail(e);
  }
}

export async function coachThreads(env) {
  const r = await env.DB.prepare(
    `SELECT t.coach_date, (SELECT COUNT(*) FROM chat_message m WHERE m.thread_id = t.id) AS n,
            (SELECT text FROM chat_message m WHERE m.thread_id = t.id AND m.role = 'assistant' ORDER BY created_at, rowid LIMIT 1) AS first_text
     FROM chat_thread t ORDER BY t.coach_date DESC LIMIT 30`).all();
  return json({ threads: (r.results || []).map((x) => ({ coach_date: x.coach_date, messages: x.n, preview: (x.first_text || '').slice(0, 120) })) });
}

export async function coachThread(url, env) {
  const date = V.date(url.searchParams.get('date'), 'date');
  const th = await env.DB.prepare('SELECT * FROM chat_thread WHERE coach_date = ?1').bind(date).first();
  if (!th) return json({ error: 'not_found' }, 404);
  return json(await threadPayload(env, th));
}
