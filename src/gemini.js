// לקוח Gemini (generateContent) ל-Workers. בסיס: הקוד שכתב סוכן המחקר C, אחרי בדיקה והתאמה.
// מפתח רק בכותרת x-goog-api-key (לעולם לא ב-URL, כי הוא נשמר ביומנים). store:false כדי שגוגל לא תשמור את הבקשה.
import { localDate } from './util.js';

const BASE = 'https://generativelanguage.googleapis.com/v1beta';
export const FAST = 'gemini-3.8-flash';   // יציב מ-2.9.2026. רמות חשיבה: low, medium, high (minimal מחזיר שגיאה)

const url = (env, model, method) => `${env.GEMINI_BASE || BASE}/models/${model}:${method}`;
// מפתח Gemini הוא ASCII גלוי בלבד. רווח, שורה חדשה, סימן כיווניות (RLM) או רצף בקרה שנדבקו בטעות גורמים ל-"API key not valid", ולכן מסירים אותם
const cleanKey = (v) => String(v == null ? '' : v).replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]/g, '').replace(/[^\x21-\x7E]/g, '');
// צורת המפתח ששמור בשרת (אורך ותחילית בלבד, בלי הערך). הפורמט הישן: AIza עם 39 תווים. הפורמט החדש של גוגל מתחיל ב-AQ. (אורך שונה)
export const keyShape = (env) => { const k = cleanKey(env.GEMINI_API_KEY); return { len: k.length, prefixOk: k.startsWith('AIza') || k.startsWith('AQ.') }; };
const headers = (env) => ({ 'content-type': 'application/json', 'x-goog-api-key': cleanKey(env.GEMINI_API_KEY) });

export class GeminiError extends Error {
  constructor(code, status = 502) { super(code); this.code = code; this.status = status; }
}
const codeFor = (status) => (status === 429 ? 'gemini_quota' : status === 402 ? 'gemini_billing' : status === 401 || status === 403 ? 'gemini_key' : status === 400 ? 'gemini_bad_request' : 'gemini_unavailable');

// תקרה יומית של קריאות: מגינה על מכסה חינמית ועל חשבון בתשלום מפני תקלה או לולאה. ברירת מחדל 120, ניתן לשנות ב-GEMINI_DAILY_CAP.
export async function bumpUsage(env) {
  const cap = Number(env.GEMINI_DAILY_CAP) || 120;
  const today = localDate();
  await env.DB.prepare('INSERT INTO gemini_usage (local_date, calls) VALUES (?1, 0) ON CONFLICT(local_date) DO NOTHING').bind(today).run();
  const r = await env.DB.prepare('UPDATE gemini_usage SET calls = calls + 1 WHERE local_date = ?1 AND calls < ?2').bind(today, cap).run();
  if (!r.meta.changes) throw new GeminiError('daily_cap', 429);
}

// מודל גיבוי כשהראשי עמוס: המודל היציב הגבוה ביותר משפחת flash מדור 3 ומעלה (שם החשיבה thinkingLevel קיים רק שם). נשמר בזיכרון ה-isolate
let fallbackName;
async function fallbackModel(env, current) {
  if (fallbackName !== undefined) return fallbackName === current ? null : fallbackName;
  fallbackName = null;
  try {
    const r = await fetch(`${env.GEMINI_BASE || BASE}/models?pageSize=200`, { headers: headers(env) });
    const j = await r.json().catch(() => ({}));
    const list = ((j && j.models) || []).filter((m) => /^models\/gemini-\d+(\.\d+)?-flash$/.test(m.name) && (m.supportedGenerationMethods || []).includes('generateContent'))
      .map((m) => ({ id: m.name.replace('models/', ''), v: parseFloat(m.name.match(/gemini-(\d+(?:\.\d+)?)/)[1]) })).filter((m) => m.v >= 3).sort((a, b) => b.v - a.v);
    console.log('gemini models', ((j && j.models) || []).map((m) => m.name.replace('models/', '')).filter((n) => /flash|lite|pro/.test(n) && !/image|tts|audio|live|embedding|robotics/.test(n)).join(','));
    const pick = list.find((m) => m.id !== current);
    fallbackName = pick ? pick.id : null;
  } catch { /* בלי גיבוי */ }
  return fallbackName === current ? null : fallbackName;
}

// מודל שהחזיר 503 מסומן "חם" ל-5 דקות, ופניות הבאות מתחילות ממודל אחר. גוגל מחזיקה בקשה עמוסה עד כ-19 שניות לפני שהיא מחזירה 503, ולכן גם מגבילים כל ניסיון
const hot = new Map();
const TRY_MS = 20000;

async function post(env, model, body) {
  let r;
  try { r = await fetch(url(env, model, 'generateContent'), { method: 'POST', headers: headers(env), body: JSON.stringify({ store: false, ...body }), signal: AbortSignal.timeout(TRY_MS) }); }
  catch (e) { if (e && e.name === 'TimeoutError') return { r: { ok: false, status: 503 }, j: {} }; throw new GeminiError('gemini_unavailable'); }
  return { r, j: await r.json().catch(() => ({})) };
}

export async function generate(env, body, model = FAST) {
  if (!env.GEMINI_API_KEY) throw new GeminiError('gemini_not_configured', 503);
  await bumpUsage(env);   // קריאה אחת בתקרה היומית, גם אם יש כמה ניסיונות
  const t0 = Date.now();
  const order = [model, await fallbackModel(env, model)].filter(Boolean);
  const fresh = order.filter((m) => !(hot.get(m) > Date.now()));
  let r, j, used;
  for (const m of fresh.length ? fresh : order) {
    used = m;
    ({ r, j } = await post(env, m, body));
    if (![500, 503].includes(r.status)) break;
    hot.set(m, Date.now() + 5 * 60 * 1000);
  }
  const u = (j && j.usageMetadata) || {};
  try { await env.DB.prepare('UPDATE gemini_usage SET tokens_in = tokens_in + ?1, tokens_out = tokens_out + ?2 WHERE local_date = ?3').bind(u.promptTokenCount || 0, (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0), localDate()).run(); } catch { /* לא מפילים בקשה בגלל מונה */ }
  // טוקנים בפועל לכל קריאה, כדי לחשב עלות אמיתית אחרי שבוע שימוש
  console.log('gemini', used, r.status, `${Date.now() - t0}ms`, `in=${u.promptTokenCount ?? '-'} out=${u.candidatesTokenCount ?? '-'} think=${u.thoughtsTokenCount ?? '-'}`);
  if (!r.ok) {
    const msg = (j && j.error && j.error.message) || '';
    console.error('gemini error', r.status, msg, JSON.stringify(keyShape(env)));
    // גוגל מחזירה 400 (ולא 401) על מפתח לא תקין, ולכן מזהים לפי ההודעה
    throw new GeminiError(/API key/i.test(msg) ? 'gemini_key' : codeFor(r.status), r.status === 429 ? 429 : 502);
  }
  return j;
}

// בדיקה עצמית של המפתח: שליפת פרטי המודל. לא צורכת מכסת יצירה ולא נספרת בתקרה היומית
export async function keyCheck(env) {
  const shape = keyShape(env);
  if (!env.GEMINI_API_KEY) return { hasKey: false, ...shape, ok: false };
  let r;
  try { r = await fetch(url(env, FAST, '').replace(/:$/, ''), { headers: headers(env) }); } catch { return { hasKey: true, ...shape, ok: false, status: 0 }; }
  const j = await r.json().catch(() => ({}));
  return { hasKey: true, ...shape, ok: r.ok, status: r.status, error: r.ok ? null : ((j && j.error && j.error.status) || 'error') };
}

export const textOf = (parts = []) => parts.filter((p) => p.text && !p.thought).map((p) => p.text).join('');

/* ---------- ניתוח ארוחה ---------- */
const MEAL_SYSTEM =
  // בכוונה בלי פרטים רפואיים על המשתמש: ניתוח ארוחה לא צריך אותם, ומידע מינימלי הוא הגנה טובה יותר על הפרטיות.
  'אתה מעריך ערכים תזונתיים מתמונות ומתיאורים בעברית, עבור אפליקציית ליווי שינה. ' +
  'המטרה היא להבין איך האוכל, הקפאין והאלכוהול משפיעים על השינה, ולא לספור קלוריות בקפדנות.\n' +
  'יחידות מטריות ומטבח ישראלי. פרק כל ארוחה לרכיבים עם משקל בגרמים לכל רכיב. תן מספר אחד לכל שדה, לא טווח.\n' +
  'הערך גם: קפאין במ״ג (קפה, תה, שוקולד, משקאות אנרגיה, 0 אם אין), אלכוהול בגרמי אתנול טהור (כוס יין כ-14, בירה של 330 מ״ל כ-13, משקה חריף כ-13, 0 אם אין), ' +
  'ועומס גליקמי משוער של הארוחה כולה: low, medium או high.\n' +
  'kind: meal לארוחה, snack לנשנוש, drink למשקה. ' +
  'confidence: high כשהכמויות ברורות, medium כשיש הערכת נפח, low כשחסר מידע קריטי. ' +
  'אם שאלה אחת או שתיים ישפרו משמעותית את הדיוק (סוג משקה, רוטב, גודל מנה), החזר אותן ב-questions עם אפשרויות קצרות. אחרת מערך ריק.\n' +
  'אל תיתן ייעוץ רפואי ואל תשפוט את הבחירות. note הוא משפט אחד עובדתי על ההערכה. כתוב בעברית טבעית ובלי מקף ארוך.';

const MEAL_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'שם קצר לארוחה בעברית, עד 4 מילים' },
    kind: { type: 'string', enum: ['meal', 'snack', 'drink'] },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' }, grams: { type: 'number' }, kcal: { type: 'number' }, protein_g: { type: 'number' }, carbs_g: { type: 'number' },
          sugar_g: { type: 'number' }, fiber_g: { type: 'number' }, fat_g: { type: 'number' }, sat_fat_g: { type: 'number' },
        },
        required: ['name', 'grams', 'kcal', 'protein_g', 'carbs_g', 'sugar_g', 'fiber_g', 'fat_g', 'sat_fat_g'],
      },
    },
    caffeine_mg: { type: 'number' },
    alcohol_g: { type: 'number' },
    glycemic_load: { type: 'string', enum: ['low', 'medium', 'high'] },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    questions: { type: 'array', items: { type: 'object', properties: { q: { type: 'string' }, options: { type: 'array', items: { type: 'string' } } }, required: ['q', 'options'] } },
    note: { type: 'string' },
  },
  required: ['name', 'kind', 'items', 'caffeine_mg', 'alcohol_g', 'glycemic_load', 'confidence', 'questions', 'note'],
};

const clamp = (v, lo, hi) => { const x = Number(v); return Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : 0; };
const r1 = (x) => Math.round(x * 10) / 10;

// לא סומכים על הסיכומים של המודל: מחשבים סכומים מהרכיבים, וחותכים ערכים לטווח סביר
export function normalizeMeal(j) {
  const items = (Array.isArray(j && j.items) ? j.items : []).slice(0, 30).map((it) => ({
    name: String(it.name || '').slice(0, 80),
    grams: r1(clamp(it.grams, 0, 3000)), kcal: Math.round(clamp(it.kcal, 0, 4000)), protein_g: r1(clamp(it.protein_g, 0, 300)),
    carbs_g: r1(clamp(it.carbs_g, 0, 600)), sugar_g: r1(clamp(it.sugar_g, 0, 400)), fiber_g: r1(clamp(it.fiber_g, 0, 100)),
    fat_g: r1(clamp(it.fat_g, 0, 300)), sat_fat_g: r1(clamp(it.sat_fat_g, 0, 150)),
  })).filter((it) => it.name);
  const sum = (k) => items.reduce((a, it) => a + it[k], 0);
  const pick = (v, list, d) => (list.includes(v) ? v : d);
  return {
    name: String((j && j.name) || (items[0] && items[0].name) || 'ארוחה').slice(0, 60),
    kind: pick(j && j.kind, ['meal', 'snack', 'drink'], 'meal'),
    items,
    totals: { kcal: Math.round(sum('kcal')), protein_g: r1(sum('protein_g')), carbs_g: r1(sum('carbs_g')), sugar_g: r1(sum('sugar_g')), fiber_g: r1(sum('fiber_g')), fat_g: r1(sum('fat_g')), sat_fat_g: r1(sum('sat_fat_g')) },
    caffeine_mg: Math.round(clamp(j && j.caffeine_mg, 0, 1000)),
    alcohol_g: r1(clamp(j && j.alcohol_g, 0, 300)),
    glycemic_load: pick(j && j.glycemic_load, ['low', 'medium', 'high'], null),
    confidence: pick(j && j.confidence, ['low', 'medium', 'high'], 'low'),
    questions: (Array.isArray(j && j.questions) ? j.questions : []).slice(0, 2)
      .map((q) => ({ q: String(q.q || '').slice(0, 120), options: (Array.isArray(q.options) ? q.options : []).slice(0, 5).map((o) => String(o).slice(0, 40)) })).filter((q) => q.q),
    note: String((j && j.note) || '').slice(0, 200),
  };
}

export async function analyzeMeal(env, { image, mime = 'image/jpeg', text = '' }) {
  const parts = [{ text: 'הערך את הארוחה.' + (text ? `\nתיאור מהמשתמש: ${text}` : '') }];   // הטקסט לפני התמונה, לפי התיעוד
  if (image) parts.push({ inlineData: { mimeType: mime, data: image } });
  const r = await generate(env, {
    systemInstruction: { parts: [{ text: MEAL_SYSTEM }] },
    contents: [{ role: 'user', parts }],
    generationConfig: { responseMimeType: 'application/json', responseJsonSchema: MEAL_SCHEMA, thinkingConfig: { thinkingLevel: 'LOW' }, maxOutputTokens: 3000 },
  });
  const cand = r.candidates && r.candidates[0];
  if (!cand || cand.finishReason === 'SAFETY') throw new GeminiError('no_food_detected', 422);
  let j;
  try { j = JSON.parse(textOf(cand.content && cand.content.parts)); } catch { throw new GeminiError('gemini_bad_response'); }
  const meal = normalizeMeal(j);
  if (!meal.items.length) throw new GeminiError('no_food_detected', 422);
  return meal;
}

/* ---------- פתיחת יום ---------- */
// topics: מזהי נושאים מהספרייה המאומתת. ה-enum מונע מהמודל להמציא מזהה, והשרת מאמת שוב לפני השמירה
const openerSchema = (topicIds = []) => ({
  type: 'object',
  properties: {
    text: { type: 'string' }, quick_replies: { type: 'array', items: { type: 'string' } },
    ...(topicIds.length ? { topics: { type: 'array', items: { type: 'string', enum: topicIds } } } : {}),
  },
  required: ['text', 'quick_replies'],
});

export async function generateOpener(env, { system, prompt, topicIds = [] }) {
  const r = await generate(env, {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json', responseJsonSchema: openerSchema(topicIds), thinkingConfig: { thinkingLevel: 'LOW' }, maxOutputTokens: 1500 },
  });
  const cand = r.candidates && r.candidates[0];
  let j;
  try { j = JSON.parse(textOf(cand && cand.content && cand.content.parts)); } catch { throw new GeminiError('gemini_bad_response'); }
  const text = String((j && j.text) || '').trim().slice(0, 900);
  if (!text) throw new GeminiError('gemini_bad_response');
  const quick = (Array.isArray(j.quick_replies) ? j.quick_replies : []).slice(0, 3).map((q) => String(q).trim().slice(0, 40)).filter(Boolean);
  const topics = (Array.isArray(j.topics) ? j.topics : []).filter((t) => topicIds.includes(t)).slice(0, 3);
  return { text, quick_replies: quick, topics, usage: r.usageMetadata };
}

/* ---------- שיחה עם כלים ---------- */
// חשוב: מחזירים למודל את התור שלו כמו שהוא (כולל thoughtSignature ו-id), והתשובות לכלים חוזרות כ-role user. אחרת Gemini 3 דוחה את הבקשה.
export async function coachChat(env, { system, history, tools, exec, maxSteps = 4 }) {
  const contents = history.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] }));
  // Gemini מצפה שהשיחה תתחיל בתור של המשתמש. הפתיחה היומית היא של המאמן, ולכן מקדימים לה תור קצר.
  if (contents.length && contents[0].role === 'model') contents.unshift({ role: 'user', parts: [{ text: 'פתחו את היום.' }] });
  for (let step = 0; step < maxSteps; step++) {
    const r = await generate(env, {
      systemInstruction: { parts: [{ text: system }] },
      contents,
      tools: [{ functionDeclarations: tools }],
      toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
      generationConfig: { thinkingConfig: { thinkingLevel: 'LOW' }, maxOutputTokens: 2048 },
    });
    const content = r.candidates && r.candidates[0] && r.candidates[0].content;
    const calls = ((content && content.parts) || []).filter((p) => p.functionCall);
    if (!calls.length) {
      const text = textOf(content && content.parts).trim();
      if (!text) throw new GeminiError('gemini_bad_response');
      return { text, usage: r.usageMetadata, steps: step };
    }
    contents.push(content);
    const out = [];
    for (const { functionCall: { id, name, args } } of calls) {
      let response;
      try {
        if (!exec[name]) throw new Error('unknown tool');
        response = { result: await exec[name](args || {}) };
      } catch (e) { response = { error: String(e.message).slice(0, 200) }; }
      out.push({ functionResponse: { ...(id && { id }), name, response } });
    }
    contents.push({ role: 'user', parts: out });
  }
  throw new GeminiError('gemini_too_many_steps');
}

// עלות משוערת בדולרים לפי מחירון גוגל ל-Gemini Flash (למיליון טוקנים). המחיר מוכפל מ-1.1.2027
export const usd = (tin, tout, date = localDate()) => {
  const [pi, po] = date >= '2027-01-01' ? [1.5, 7.5] : [0.75, 3.75];
  return Math.round(((tin * pi + tout * po) / 1e6) * 100) / 100;
};
