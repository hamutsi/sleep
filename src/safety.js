// כללי בטיחות של המאמן (מדוח B2: R-MED-1, R-DX-1, R-URG-1). זו רשת ביטחון שנייה: הכלל הראשי הוא ההנחיה למודל.
// בכוונה לא חוסמים תשובות (חסימה תיתן תוצאות שגויות על ניסוח בטוח כמו "לא להפסיק את הסטטין"), אלא מוסיפים שורה קבועה.

export const MED_LINE = 'לגבי תרופות: לא משנים, לא מפסיקים, לא מדלגים ולא מזיזים שעה בלי שיחה עם הרופא.ה או הרוקח.';

// שם תרופה או קבוצה, ליד פועל של שינוי, בטווח קצר
const MED = /(סטטין|תרופ|כדור|מינון|statin|atorva|rosuva|simva|prava|lova|metformin|מטפורמין|אינסולין)/i;
const CHANGE = /(להפסיק|תפסיק|הפסק|לדלג|תדלג|דלג|להזיז|תזיז|הזז|לשנות|תשנה|שנה את|לחצות|להחליף|תחליף|לקחת ב|לקחת בבוקר|לקחת בערב|stop|skip|switch|change|halve|split|take it (in|at))/i;

export function guardReply(text) {
  const t = String(text || '');
  const near = (a, b, span = 45) => { for (const m of t.matchAll(new RegExp(a.source, 'gi'))) { const w = t.slice(Math.max(0, m.index - span), m.index + m[0].length + span); if (b.test(w)) return true; } return false; };
  if (near(MED, CHANGE) && !t.includes(MED_LINE)) return { text: `${t.trim()}\n\n${MED_LINE}`, flags: ['med_line_added'] };
  return { text: t, flags: [] };
}

// סימני אזהרה בהודעה של המשתמש. תשובה קבועה שדורסת כל תשובה אחרת (R-URG-1), ללא קריאה למודל.
const URGENT_CHEST = /(כאב בחזה|לחץ בחזה|קוצר נשימה|קשה לנשום|איבדתי הכרה|עילפון|התעלפתי)/;
const URGENT_STROKE = /(קשיי דיבור|קשה לי לדבר|חולשה בצד אחד|צד אחד של הפנים|עיוות בפנים)/;
const URGENT_MUSCLE = /(שתן כהה|שתן בצבע קולה|כאב שרירים חזק|חולשה שרירית|חולשה בשרירים)/;

export function redFlag(userText) {
  const t = String(userText || '');
  if (URGENT_CHEST.test(t) || URGENT_STROKE.test(t)) return { kind: 'emergency', text: 'זה נשמע כמו משהו שצריך בדיקה דחופה. כאב בחזה, קוצר נשימה, עילפון או סימנים של שבץ: לפנות עכשיו לשירותי חירום (101 או 100). לא מחכים לתובנות של האפליקציה.' };
  if (URGENT_MUSCLE.test(t)) return { kind: 'muscle', text: 'כאב שרירים, רגישות או חולשה לא מוסברים, במיוחד עם חום, תחושה כללית רעה או שתן כהה: לפנות לרופא.ה עוד היום. אם נוטלים סטטין, כדאי לספר להם על כך. לא להפסיק או לשנות תרופה לבד.' };
  return null;
}
