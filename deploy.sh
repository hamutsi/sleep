#!/usr/bin/env bash
# פריסה של "מאמן שינה" ל-Cloudflare: Worker אחד עם קבצים סטטיים, מסד D1 ודומיין sleep.adaptation.work.
# הרצה:  bash deploy.sh        (בטוח להריץ שוב ושוב. לא מחליף סודות שכבר קיימים)
set -euo pipefail
cd "$(dirname "$0")"

# יש שני חשבונות ב-wrangler. זה החשבון של ליאור (Lior@thefrenkel.com), כמו בשאר האפליקציות.
export CLOUDFLARE_ACCOUNT_ID=e6f7ac4467d0a272df8dcf946ccaf447
W="npx --yes wrangler@latest"

echo "▸ מרכיב ומאמת את ספריית \"למה ככה?\" (נכשל אם יש שדה חסר, קישור מחוץ לרשימה או מקף ארוך)"
node tools/build_evidence.mjs || { echo "הספרייה לא תקינה. לא פורסים."; exit 1; }

echo "▸ בודק חיבור ל-Cloudflare"
$W whoami >/dev/null 2>&1 || { echo "לא מחובר. מריץ wrangler login (ייפתח דפדפן)"; $W login; }

if grep -q "REPLACE_WITH_D1_ID" wrangler.toml; then
  echo "▸ יוצר מסד D1 בשם sleep-coach"
  OUT=$($W d1 create sleep-coach 2>&1) || { echo "$OUT"; exit 1; }
  ID=$(echo "$OUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
  [ -n "$ID" ] || { echo "לא הצלחתי לקרוא את מזהה המסד. הפלט היה:"; echo "$OUT"; exit 1; }
  sed -i '' "s/REPLACE_WITH_D1_ID/$ID/" wrangler.toml
  echo "  נוצר: $ID"
fi

echo "▸ מריץ מיגרציות על המסד"
$W d1 migrations apply DB --remote

echo "▸ פורס"
$W deploy

# סודות שנוצרים אקראית ונשמרים בלי להציג אותם. לא מחליפים סוד קיים:
# החלפה של DATA_KEY תהפוך טוקנים שמורים לבלתי קריאים, והחלפה של SESSION_SECRET תנתק את כל המכשירים.
EXISTING=$($W secret list 2>/dev/null || true)
for NAME in SESSION_SECRET DATA_KEY; do
  if echo "$EXISTING" | grep -q "\"$NAME\""; then
    echo "  קיים כבר: $NAME"
  else
    openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n' | $W secret put "$NAME" >/dev/null 2>&1 && echo "  נוצר אקראית: $NAME"
  fi
done

echo
echo "בוצע. הכתובת: https://sleep.adaptation.work"
echo "השלב הבא: bash set-secrets.sh   (סיסמה של החבר, פרטי Google ומפתח Gemini)"
