// מרכיב את ספריית "למה ככה?" מהקבצים evidence/part_*.json, מאמת אותה, ומייצר:
//   public/evidence/library.json   הספרייה המלאה. מוגשת לדפדפן ונפתחת בכפתור "למה ככה?"
//   src/evidence/catalog.js        קטלוג קומפקטי לשרת: מזהים, כותרות ווים. המאמן מצטט רק מזהים מכאן, ולעולם לא כותב קישורים
// הרצה:  node tools/build_evidence.mjs            נכשל בקול אם יש בעיה, ומשמש שער בפריסה (deploy.sh)
//        node tools/build_evidence.mjs --allow-empty   לפיתוח בלבד, כשעוד אין קבצי ספרייה
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVI = path.join(root, 'evidence');
const OUT_LIB = path.join(root, 'public', 'evidence', 'library.json');
const OUT_CAT = path.join(root, 'src', 'evidence', 'catalog.js');
const allowEmpty = process.argv.includes('--allow-empty');
const checkOnly = process.argv.includes('--check');                       // בודק בלי לכתוב קבצים
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);   // מגביל לקובץ אחד, לסקירה

const STRENGTH = ['strong', 'moderate', 'limited', 'method'];
const DESIGN = ['guideline', 'meta-analysis', 'systematic-review', 'rct', 'cohort', 'cross-sectional', 'review', 'position-statement', 'label', 'other'];
// רשימה סגורה של יעדים. כל קישור בספרייה חייב להתאים לאחד מהם, ונבדק בנפרד מול PubMed, Crossref ו-YouTube בכלי T-tools/check_links.py
const URL_OK = [
  /^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d{5,9}\/$/,
  /^https:\/\/doi\.org\/10\.\d{4,9}\/[^\s]+$/,
  /^https:\/\/pmc\.ncbi\.nlm\.nih\.gov\/articles\/PMC\d+\/$/,
  /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/,
  // עמודים רשמיים (עלוני תרופות, רשויות בריאות, איגודי לב). נבדקו ידנית: קיימים, והטענות מופיעות בהם
  /^https:\/\/www\.accessdata\.fda\.gov\/drugsatfda_docs\/label\/\d{4}\/[A-Za-z0-9_.-]+\.pdf$/,
  /^https:\/\/www\.fda\.gov\/consumers\/consumer-updates\/[a-z0-9-]+$/,
  /^https:\/\/dailymed\.nlm\.nih\.gov\/dailymed\/drugInfo\.cfm\?setid=[0-9a-f-]{36}$/,
  /^https:\/\/www\.organon\.com\/product\/usa\/pi_circulars\/[A-Za-z0-9_/.-]+\.pdf$/,
  /^https:\/\/www\.nhs\.uk\/medicines\/[a-z-]+\/$/,
  /^https:\/\/www\.nccih\.nih\.gov\/health\/[a-z0-9-]+$/,
  /^https:\/\/newsroom\.heart\.org\/news\/[a-z0-9-]+$/,
  /^https:\/\/www\.acc\.org\/about-acc\/press-releases\/[0-9/]+\/[a-z0-9-]+$/,
];
const HEB = /[֐-׿]/;
const DASH = /[—–]/;   // מקף ארוך ובינוני. אסור בכל טקסט שליאור רואה

const errors = [];
const warns = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);

const files = readdirSync(EVI).filter((f) => /^part_.+\.json$/.test(f) && (!only || f === only)).sort();
if (!files.length && !allowEmpty) { console.error('אין קבצי part_*.json בתיקיית evidence'); process.exit(1); }

const topics = [];
for (const f of files) {
  let j;
  try { j = JSON.parse(readFileSync(path.join(EVI, f), 'utf8')); } catch (e) { err(f, `JSON לא תקין: ${e.message}`); continue; }
  if (!j || !Array.isArray(j.topics)) { err(f, 'חסר מערך topics'); continue; }
  for (const t of j.topics) topics.push({ ...t, _file: f });
}

const str = (v, min, max) => typeof v === 'string' && v.trim().length >= min && v.length <= max;
const seen = new Set();
const walk = (id, v, p = '') => {
  if (typeof v === 'string') { if (DASH.test(v)) err(id, `מקף ארוך או בינוני ב-${p}`); }
  else if (Array.isArray(v)) v.forEach((x, i) => walk(id, x, `${p}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(id, x, p ? `${p}.${k}` : k);
};

for (const t of topics) {
  const id = t.id || '(ללא מזהה)';
  if (!/^[a-z][a-z0-9_]{2,60}$/.test(t.id || '')) err(id, 'מזהה חייב להיות snake_case באנגלית');
  if (seen.has(t.id)) err(id, `מזהה כפול (${t._file})`); seen.add(t.id);
  if (!str(t.title_he, 6, 140) || !HEB.test(t.title_he)) err(id, 'title_he חסר או לא בעברית');
  if (!str(t.summary_he, 40, 900) || !HEB.test(t.summary_he)) err(id, 'summary_he חסר, קצר או ארוך מדי');
  if (!STRENGTH.includes(t.strength)) err(id, `strength חייב להיות אחד מ-${STRENGTH.join(', ')}`);
  for (const k of ['strength_note_he', 'applies_to_he', 'not_mean_he']) if (!str(t[k], 10, 400) || !HEB.test(t[k])) err(id, `${k} חסר או לא בעברית`);
  if (!Array.isArray(t.hooks_he) || t.hooks_he.length < 1 || t.hooks_he.length > 4 || t.hooks_he.some((x) => !str(x, 12, 260) || !HEB.test(x))) err(id, 'hooks_he חייב להכיל 1 עד 4 משפטים בעברית (עד 260 תווים)');
  if (!Array.isArray(t.rule_ids) || t.rule_ids.some((x) => !/^R-[A-Z0-9-]+$/.test(x))) err(id, 'rule_ids חייב להיות מערך של מזהי כללים');
  if (!Array.isArray(t.tags)) err(id, 'tags חייב להיות מערך');
  if (!Array.isArray(t.sources) || t.sources.length < 1) err(id, 'חייב להיות לפחות מקור אחד');
  for (const s of t.sources || []) {
    if (!s || !/^[a-z0-9_]{2,60}$/.test(s.id || '')) err(id, `מזהה מקור לא תקין (${s && s.id})`);
    if (!str(s.title, 8, 400) || !str(s.authors_short, 2, 120) || !str(s.venue, 2, 200)) err(id, `מקור ${s && s.id}: חסר title, authors_short או venue`);
    if (!Number.isInteger(s.year) || s.year < 1990 || s.year > 2027) err(id, `מקור ${s && s.id}: שנה לא סבירה`);
    if (!DESIGN.includes(s.design)) err(id, `מקור ${s && s.id}: design לא מוכר (${s && s.design})`);
    if (!URL_OK.some((re) => re.test(s.url || ''))) err(id, `מקור ${s && s.id}: כתובת לא ברשימה המותרת (${s && s.url})`);
    if (!str(s.key_finding_en, 12, 500)) err(id, `מקור ${s && s.id}: חסר key_finding_en`);
    if (s.peer_reviewed !== true && s.peer_reviewed !== false) err(id, `מקור ${s && s.id}: peer_reviewed חייב להיות true או false`);
  }
  const sids = (t.sources || []).map((s) => s.id);
  if (new Set(sids).size !== sids.length) err(id, 'מזהי מקורות כפולים');
  if (!Array.isArray(t.videos) || t.videos.length > 3) err(id, 'videos חייב להיות מערך של עד 3');
  for (const v of t.videos || []) {
    if (!/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(v.url || '')) err(id, `סרטון: כתובת לא תקינה (${v && v.url})`);
    if (!str(v.title, 3, 300) || !str(v.channel, 2, 120)) err(id, 'סרטון: חסר title או channel');
    if (!['en', 'he'].includes(v.lang)) err(id, `סרטון: lang חייב להיות en או he (${v && v.title})`);
    if (!['A', 'B', 'C'].includes(v.tier)) err(id, `סרטון: tier חייב להיות A, B או C (${v && v.title})`);
    if (v.tier === 'C') warns.push(`${id}: סרטון בדרגה C (${v.title}). לוודא שיש caveat_he`);
    if (!str(v.note_he, 6, 300) || !HEB.test(v.note_he)) err(id, `סרטון ${v.title}: note_he חסר`);
  }
  walk(id, t);
}

if (errors.length) {
  console.error(`נכשל. ${errors.length} בעיות:\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

// רשימת סקירה: כל שורה שמזכירה תרופה, תוסף או אבחנה. לקריאה אנושית לפני פריסה (הגייטקיפר של הבטיחות)
const REVIEW = /סטטין|תרופ|מלטונין|תוסף|תוספ|מגנזיום|אבחנ|אבחון|מינון|ניאצין|אורז אדום|ברברין/;
const review = [];
for (const t of topics) for (const k of ['summary_he', 'strength_note_he', 'applies_to_he', 'not_mean_he']) if (REVIEW.test(t[k])) review.push(`${t.id}.${k}: ${t[k]}`);
for (const t of topics) t.hooks_he.forEach((x, i) => { if (REVIEW.test(x)) review.push(`${t.id}.hooks_he[${i}]: ${x}`); });

const clean = topics.map(({ _file, ...t }) => t).sort((a, b) => a.id.localeCompare(b.id));
if (checkOnly) {
  console.log(`תקין (בדיקה בלבד): ${clean.length} נושאים, ${clean.reduce((a, t) => a + t.sources.length, 0)} מקורות, ${clean.reduce((a, t) => a + t.videos.length, 0)} סרטונים`);
  if (process.argv.includes('--review')) console.log(`\nלסקירה אנושית (${review.length} שורות):\n` + review.map((r) => '  * ' + r).join('\n'));
  if (warns.length) console.log('אזהרות:\n' + warns.map((w) => '  - ' + w).join('\n'));
  process.exit(0);
}
const builtAt = new Date().toISOString().slice(0, 10);
mkdirSync(path.dirname(OUT_LIB), { recursive: true });
mkdirSync(path.dirname(OUT_CAT), { recursive: true });
writeFileSync(OUT_LIB, JSON.stringify({ version: 1, built_at: builtAt, topics: clean }));
const catalog = clean.map((t) => ({ id: t.id, title: t.title_he, strength: t.strength, tags: t.tags, hooks: t.hooks_he, rules: t.rule_ids }));
writeFileSync(OUT_CAT, `// נוצר אוטומטית על ידי tools/build_evidence.mjs. לא לערוך ידנית.\nexport const BUILT_AT = ${JSON.stringify(builtAt)};\nexport const CATALOG = ${JSON.stringify(catalog, null, 1)};\n`);

const nSrc = clean.reduce((a, t) => a + t.sources.length, 0), nVid = clean.reduce((a, t) => a + t.videos.length, 0);
const byStrength = Object.fromEntries(STRENGTH.map((s) => [s, clean.filter((t) => t.strength === s).length]));
console.log(`נבנתה ספרייה: ${clean.length} נושאים, ${nSrc} מקורות, ${nVid} סרטונים, ${clean.reduce((a, t) => a + t.hooks_he.length, 0)} ווים. חוזק: ${JSON.stringify(byStrength)}`);
if (warns.length) console.log('אזהרות:\n' + warns.map((w) => '  - ' + w).join('\n'));
if (process.argv.includes('--review')) console.log(`\nלסקירה אנושית (${review.length} שורות שמזכירות תרופה, תוסף או אבחנה):\n` + review.map((r) => '  * ' + r).join('\n'));
