#!/usr/bin/env bash
# פריסה של "מאמן שינה" ל-Cloudflare. אותו קוד נפרס לשתי כתובות, כל אחת עם Worker ומסד D1 משלה:
#   friend  →  sleep.adaptation.work        (החבר)
#   lior    →  lior.sleep.adaptation.work   (ליאור)
# הרצה:  bash deploy.sh           מעדכן את שתיהן
#        bash deploy.sh lior      רק אחת (friend או lior)
# בטוח להריץ שוב ושוב. לא מחליף סודות שכבר קיימים.
set -euo pipefail
cd "$(dirname "$0")"

# יש שני חשבונות ב-wrangler. זה החשבון של ליאור (Lior@thefrenkel.com), כמו בשאר האפליקציות.
export CLOUDFLARE_ACCOUNT_ID=e6f7ac4467d0a272df8dcf946ccaf447
W="npx --yes wrangler@latest"

if [ $# -eq 0 ]; then TARGETS=(friend lior); else TARGETS=("$@"); fi
for T in "${TARGETS[@]}"; do
  case "$T" in friend|lior) ;; *) echo "יעד לא מוכר: $T (אפשר friend או lior)"; exit 1 ;; esac
done

echo "▸ מרכיב ומאמת את ספריית \"למה ככה?\" (נכשל אם יש שדה חסר, קישור מחוץ לרשימה או מקף ארוך)"
node tools/build_evidence.mjs || { echo "הספרייה לא תקינה. לא פורסים."; exit 1; }

echo "▸ בודק חיבור ל-Cloudflare"
$W whoami >/dev/null 2>&1 || { echo "לא מחובר. מריץ wrangler login (ייפתח דפדפן)"; $W login; }

deploy_one() {
  local T="$1" ENVFLAG="" DBNAME="sleep-coach" MARK="REPLACE_WITH_D1_ID" URL="https://sleep.adaptation.work"
  if [ "$T" = "lior" ]; then ENVFLAG="--env lior"; DBNAME="sleep-coach-lior"; MARK="REPLACE_WITH_LIOR_D1_ID"; URL="https://lior.sleep.adaptation.work"; fi
  echo
  echo "===== $T  ($URL) ====="

  if grep -q "$MARK" wrangler.toml; then
    echo "▸ יוצר מסד D1 בשם $DBNAME"
    OUT=$($W d1 create "$DBNAME" 2>&1) || { echo "$OUT"; exit 1; }
    ID=$(echo "$OUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
    [ -n "$ID" ] || { echo "לא הצלחתי לקרוא את מזהה המסד. הפלט היה:"; echo "$OUT"; exit 1; }
    sed -i '' "s/$MARK/$ID/" wrangler.toml
    echo "  נוצר: $ID  (wrangler.toml עודכן. כדאי לעשות commit)"
  fi

  echo "▸ מריץ מיגרציות על המסד"
  $W d1 migrations apply DB --remote $ENVFLAG

  echo "▸ פורס"
  $W deploy $ENVFLAG

  # סודות שנוצרים אקראית ונשמרים בלי להציג אותם. לא מחליפים סוד קיים:
  # החלפה של DATA_KEY תהפוך טוקנים שמורים לבלתי קריאים, והחלפה של SESSION_SECRET תנתק את כל המכשירים.
  local EXISTING
  EXISTING=$($W secret list $ENVFLAG 2>/dev/null || true)
  for NAME in SESSION_SECRET DATA_KEY; do
    if echo "$EXISTING" | grep -q "\"$NAME\""; then
      echo "  קיים כבר: $NAME"
    else
      openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n' | $W secret put "$NAME" $ENVFLAG >/dev/null 2>&1 && echo "  נוצר אקראית: $NAME"
    fi
  done
  echo "בוצע: $URL"
}

for T in "${TARGETS[@]}"; do deploy_one "$T"; done

echo
echo "אם זו פריסה ראשונה של יעד: bash set-secrets.sh <friend|lior>   (סיסמה, פרטי Google ומפתח Gemini)"
