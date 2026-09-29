// יעדי תזונה יומיים לגבר מתאמן, כברירת מחדל שאפשר לעדכן בפרופיל. אלה יעדי התייחסות כלליים ולא ייעוץ תזונתי.
// חלבון: 1.6 עד 2.2 גרם לק"ג לאימוני כוח (מטא-אנליזה של Morton 2018 מצאה מישור סביב 1.6, עמדת ISSN מציעה 1.4 עד 2.0). היעד כאן 1.8, באמצע.
// שומן: 20 עד 35 אחוז מהאנרגיה (AMDR), היעד כאן עד 30. שומן רווי: עד 10 אחוז (הנחיות התזונה האמריקאיות), ועם כולסטרול גבוה עדיף פחות.
// סוכרים: הנחיות ה-WHO מגבילות סוכרים חופשיים ל-10 אחוז מהאנרגיה. ההערכה כאן היא סוכרים כוללים (גם מפירות וחלב), ולכן היא רק מדד גס.
// סיבים: 14 גרם לכל 1000 קק"ל (הנחיות התזונה האמריקאיות). פחמימות: כ-40 אחוז מהאנרגיה (מתון, בגלל טרום סוכרת והמטרה של הורדת סוכר), מהסוג המורכב.
// מטרה muscle_gain (ברירת המחדל): עודף מתון של כ-250 קק"ל מעל ההערכה, כי עלייה של כ-3 ק"ג שריר בחצי שנה היא כחצי קילו בחודש, וקצב כזה לא דורש עודף גדול. עודף גדול יעלה סוכר ושומן.
export const DEFAULT_WEIGHT_KG = 68;
const AGE_ASSUMED = 47;

// who: הפרופיל של הפריסה (persona.js). בלי who מתנהגים כמו קודם: גבר בן 47, פעילות 1.55
export function nutritionTargets(profile = {}, who = {}) {
  const age = who.age || AGE_ASSUMED, sexK = who.sex === 'female' ? -161 : 5, act = who.activity || 1.55;
  const weightAssumed = !profile.weight_kg;
  const w = profile.weight_kg || DEFAULT_WEIGHT_KG;
  // הערכת אנרגיה (Mifflin-St Jeor לגבר, גורם פעילות 1.55 למתאמן 4 פעמים בשבוע) כשלא הוגדר יעד
  const est = profile.height_cm ? Math.round((10 * w + 6.25 * profile.height_cm - 5 * age + sexK) * act / 10) * 10 : Math.round((w * 35) / 10) * 10;
  const goal = profile.goal || 'muscle_gain';
  const kcalAssumed = !profile.kcal_target;
  const kcal = profile.kcal_target || est + (goal === 'muscle_gain' ? 250 : 0);
  const g = (share, per) => Math.round((kcal * share) / per);
  return {
    weight_kg: w, weight_assumed: weightAssumed, kcal_assumed: kcalAssumed, goal,
    kcal: { goal: kcal, kind: 'target' },
    protein_g: { goal: Math.round(w * 1.8), min: Math.round(w * 1.6), kind: 'min' },
    carbs_g: { goal: g(0.4, 4), kind: 'guide' },
    fat_g: { goal: g(0.3, 9), kind: 'max' },
    sat_fat_g: { goal: g(0.1, 9), kind: 'max' },
    sugar_g: { goal: g(0.1, 4), kind: 'max' },
    fiber_g: { goal: Math.round((14 * kcal) / 1000), kind: 'min' },
  };
}
