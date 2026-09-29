#!/usr/bin/env bash
# הזנת הסודות של "מאמן שינה" ל-Cloudflare, בטרמינל, בלי להציג אותם על המסך ובלי לשמור בשום קובץ.
# הרצה:  bash set-secrets.sh [friend|lior]
# אפשר להריץ שוב בכל זמן. Enter ריק משאיר את הסוד הקיים כמו שהוא.
set -euo pipefail
cd "$(dirname "$0")"
export CLOUDFLARE_ACCOUNT_ID=e6f7ac4467d0a272df8dcf946ccaf447
W="npx --yes wrangler@latest"

# יעד: friend (ברירת מחדל, sleep.adaptation.work) או lior (lior.sleep.adaptation.work). לכל יעד סודות נפרדים
T="${1:-friend}"
case "$T" in
  friend) ENVFLAG=""; WHO="החבר" ;;
  lior)   ENVFLAG="--env lior"; WHO="ליאור" ;;
  *) echo "יעד לא מוכר: $T (אפשר friend או lior)"; exit 1 ;;
esac
echo "מגדיר סודות עבור: $WHO ($T)"

put() { printf '%s' "$2" | $W secret put "$1" $ENVFLAG >/dev/null 2>&1 && echo "  נשמר: $1" || { echo "  נכשל: $1"; exit 1; }; }

echo
echo "1) סיסמת הכניסה של $WHO"
echo "   מומלץ 12 תווים ומעלה, למשל שלוש מילים לא קשורות ומספר. מקלידים אותה פעם אחת ל-180 יום. לא תוצג על המסך."
read -r -s -p "   סיסמה (Enter כדי לדלג): " P1; echo
if [ -n "$P1" ]; then
  read -r -s -p "   שוב, לאישור: " P2; echo
  [ "$P1" = "$P2" ] || { echo "   הסיסמאות לא זהות. מפסיק."; exit 1; }
  if [ "${#P1}" -lt 12 ]; then
    echo "   הסיסמה קצרה מ-12 תווים. האתר פתוח לאינטרנט ובו נתונים רפואיים של $WHO, וסיסמה קצרה או כזו שנגזרת משם קלה לניחוש."
    read -r -p "   להמשיך בכל זאת? (y/N): " OKSHORT
    case "$OKSHORT" in y|Y) ;; *) echo "   מפסיק. אפשר להריץ שוב."; exit 1 ;; esac
  fi
  PEPPER=$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n')
  VERIFIER=$(P="$P1" K="$PEPPER" node -e '
    const c = require("crypto");
    const n = (s) => s.normalize("NFKC").trim();
    process.stdout.write(c.createHmac("sha256", process.env.K).update("login:" + n(process.env.P)).digest("base64url"));')
  put LOGIN_PEPPER "$PEPPER"
  put PASS_VERIFIER "$VERIFIER"
  unset P1 P2 PEPPER VERIFIER
fi

echo
echo "2) חיבור ל-Google Health (מ-Google Cloud, שלב Clients)"
read -r -p "   Client ID (מסתיים ב-.apps.googleusercontent.com, Enter כדי לדלג): " CID
[ -z "$CID" ] || put GOOGLE_CLIENT_ID "$CID"
read -r -s -p "   Client secret (לא יוצג, Enter כדי לדלג): " CSEC; echo
[ -z "$CSEC" ] || put GOOGLE_CLIENT_SECRET "$CSEC"
unset CID CSEC

echo
echo "3) מפתח Gemini של $WHO (לא יוצג, Enter כדי לדלג)"
read -r -s -p "   מפתח: " GK; echo
if [ -n "$GK" ]; then
  # בדיקת תקינות לפני השמירה. המפתח עובר ל-curl דרך stdin, כך שהוא לא מופיע ברשימת התהליכים.
  CODE=$(printf 'header = "x-goog-api-key: %s"\n' "$GK" | curl -sS -K - -o /dev/null -w "%{http_code}" --max-time 20 \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash" 2>/dev/null || echo 000)
  SAVE=y
  case "$CODE" in
    200) echo "   המפתח תקין והמודל gemini-3.8-flash זמין." ;;
    400|401|403)
      echo "   גוגל דחתה את המפתח (קוד $CODE). כנראה הוא ישן וללא הגבלה, או שהוא לא מפרויקט שמקושר לחיבור."
      read -r -p "   לשמור בכל זאת? (y/N): " SAVE ;;
    *) echo "   לא הצלחתי לבדוק כרגע (קוד $CODE). שומר בלי אימות." ;;
  esac
  case "$SAVE" in y|Y) put GEMINI_API_KEY "$GK" ;; *) echo "   לא נשמר." ;; esac
fi
unset GK

echo
echo "   באיזו שכבה נמצא המפתח? זה קובע אם המאמן (שיחה ונתוני בריאות) יופעל."
echo "   p = בחיוב (Tier 1, מומלץ). גוגל לא משתמשת בתוכן לשיפור מוצרים."
echo "   f = חינמי. גוגל עשויה להשתמש בתוכן, ואנשים עשויים לקרוא אותו. אני מבין את זה ובוחר להפעיל."
echo "   Enter = לא מפעילים את המאמן עכשיו (ניתוח תמונות ארוחה ימשיך לעבוד)."
read -r -p "   בחירה (p/f/Enter): " TIER
case "$TIER" in
  p|P) put GEMINI_TIER paid ;;
  f|F) put GEMINI_TIER free ;;
  *) echo "   המאמן נשאר כבוי." ;;
esac

echo
echo "בוצע. הסודות נכנסים לתוקף מיד, בלי פריסה מחדש."
