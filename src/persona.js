// מי המשתמש של הפריסה הזו. אותו קוד נפרס פעמיים (החבר, ליאור), וכל פריסה בוחרת פרופיל לפי המשתנה PERSONA ב-wrangler.toml.
// כאן רק מה שקובע את ההנחיות: גיל, מין, אימונים ומצבים רפואיים. משקל, גובה ושעות שינה נשמרים במסד דרך מסך הפרופיל.
// ברירת המחדל היא החבר, כדי שפריסה קיימת בלי PERSONA תתנהג בדיוק כמו קודם.
export const PERSONAS = {
  friend: {
    age: 47, sex: 'male',
    who: 'גבר, בן 47, רזה, מתאמן ארבע פעמים בשבוע (כוח ואירובי). כולסטרול גבוה שמטופל בסטטין, וטרום סוכרת.',
    statin: true, prediabetes: true,
    glucoseCtx: 'בטרום סוכרת',              // איך מנסחים "בגלל הסוכר" בכרטיסי התובנות
    activity: 1.55,                          // Mifflin-St Jeor: 3 עד 5 אימונים בשבוע
  },
  lior: {
    age: 47, sex: 'male',
    // גלוקוז בצום 99 מ"ג לד"ל: הגבול העליון של התקין. לפי ADA טרום סוכרת מתחילה ב-100, ולכן לא מתייגים כטרום סוכרת
    who: 'גבר, בן 47, רזה, מתאמן חמש פעמים בשבוע (שלושה אימוני כוח במכון ושניים אירוביים). כולסטרול גבוה שמטופל בסטטין. גלוקוז בצום בגבול העליון של התקין (99 מ"ג לד"ל), בלי טרום סוכרת.',
    statin: true, prediabetes: false,
    glucoseCtx: 'כשהסוכר בצום גבולי',
    activity: 1.55,
  },
};

export const persona = (env) => PERSONAS[(env && env.PERSONA) || 'friend'] || PERSONAS.friend;

// נושאים בספרייה שמנוסחים למי שיש לו טרום סוכרת. בלי טרום סוכרת הם לא נדחפים כתובנה ולא מוצעים למאמן
const PREDIABETES_ONLY = new Set(['prediabetes_sleep_glucose', 'labs_annual_recheck_prediabetes']);
const STATIN_ONLY = (t) => (t.tags || []).includes('statin');
export const topicAllowed = (p) => (t) => (p.prediabetes || !PREDIABETES_ONLY.has(t.id)) && (p.statin || !STATIN_ONLY(t));
