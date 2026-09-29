# הקמת חיבור ל-Google Health ב-Google Cloud - v1

נכתב 29.9.2026 לפי הדפים הרשמיים של גוגל (developers.google.com/health/setup והקודלאב הרשמי). זמן: כ-30 דקות. עושים את זה פעם אחת.

**כלל אחד:** את ה-Client secret לא מדביקים בשום צ'אט ולא שומרים בקובץ בתיקיית הפרויקט. שומרים במנהל סיסמאות, ומזינים אותו רק בטרמינל בפקודת `wrangler pages secret put`. ה-Client ID אינו סודי ואפשר לשלוח אותו.

## לפני שמתחילים
- חשבון גוגל לפרויקט: עדיף Gmail אישי רגיל. חשבון ארגוני (Workspace) עלול לחסום אפליקציה חיצונית.
- כתובת הג'ימייל של החבר, זו שמחוברת אצלו לאפליקציית Google Health. חייב להיות חשבון אישי ולא ארגוני.

## הצעדים
1. **פרויקט חדש.** console.cloud.google.com, למעלה "Select a project", בחלון "New Project". שם: `sleep-coach`. אם יש שדה Location ואפשר, "No organization". Create, ואז לוודא שהפרויקט נבחר בסרגל העליון.
2. **להפעיל את ה-API.** תפריט ☰, "APIs & Services", "Library". מחפשים `Google Health API` ולוחצים Enable.
3. **מסך ההסכמה.** "APIs & Services", "Credentials", "+ Create Credentials", "OAuth client ID", ואז "Configure consent screen" (או "Get Started"). ארבעה חלקים:
   - App name: `Sleep Coach`. User support email: המייל שלך. Next.
   - Audience: `External`. Next.
   - Contact information: המייל שלך. Next.
   - לסמן את ההסכמה ל-Google API Services User Data Policy. Create.
4. **הרשאות.** בתפריט הצד (Google Auth Platform) "Data Access", "Add or remove scopes". מחפשים `Google Health API` ומסמנים את ארבעת אלה (לפי הטקסט שמופיע ליד כל אחת):
   - See your Google Health sleep data
   - See your Google Health health metrics and measurement data
   - See your Google Health activity and fitness data
   - See your Google Health settings
   Update, ואז Save. לא לסמן אף הרשאת כתיבה (write).
5. **לקוח OAuth.** בתפריט הצד "Clients", "Create client". Application type: `Web application`. Name: `sleep-coach-web`. את "Authorized JavaScript origins" משאירים ריק. ב-"Authorized redirect URIs", "+ Add URI", מוסיפים שני אלה:
   - `https://sleep.adaptation.work/api/gh/callback`   (הכתובת הסופית של האתר, עודכן 29.9 אחרי הפריסה)
   - `http://localhost:8788/api/gh/callback`
   Create. יוצג Client ID ו-Client secret: מעתיקים את שניהם למנהל סיסמאות. אם יש "Download JSON", אפשר להוריד ולשמור מחוץ לתיקיית LiorTeam.
   אם כבר יצרת את הלקוח עם הכתובת הזמנית `sleep-coach.pages.dev`: Clients, לפתוח את הלקוח, "+ Add URI", להוסיף את `https://sleep.adaptation.work/api/gh/callback`, ו-Save. הכתובת חייבת להיות זהה בדיוק.
6. **משתמש בדיקה.** בתפריט הצד "Audience". לוודא ש-Publishing status הוא `Testing` ו-User type הוא `External`. תחת "Test users", "+ Add users", כתובת הג'ימייל של החבר, Save.

## מה לא לעשות עכשיו
- לא ללחוץ "Publish app". קודם החבר מתחבר פעם אחת ובודקים שהנתונים מגיעים. בשלב הזה טוקן ההרשאה פג אחרי 7 ימים (מצב Testing), ואחרי הפרסום הוא לא פג. את הפרסום נעשה יחד.

## מה מעבירים אליי
- ה-Client ID בלבד (מסתיים ב-`.apps.googleusercontent.com`).
- אישור שהצעדים 1 עד 6 הושלמו, ואם משהו נראה אחרת ממה שכתוב כאן, צילום מסך.

## אם משהו לא עובד
- "External" אפור או חסר: החשבון ארגוני. עוברים ל-Gmail אישי.
- לא מוצא את "Google Health API" בספרייה: לחפש `health.googleapis.com`, או לרענן את הדף.
- אין "Data Access" בתפריט: הוא בתפריט הצד של "Google Auth Platform" (Branding, Audience, Data Access, Clients).
- Client secret אבד: ב-Clients פותחים את הלקוח ויוצרים סוד חדש.
- בהמשך, שגיאת redirect_uri_mismatch: הכתובת בלקוח לא זהה בדיוק לכתובת האתר. מתקנים אותה בלקוח.

## מה קורה אחר כך
1. אני בונה את השלד והחיבור לגוגל, ופורס.
2. החבר נכנס לאתר, לוחץ "חיבור ל-Google Health", ואם מופיע מסך "אפליקציה לא מאומתת": Advanced, ואז Go to Sleep Coach (unsafe).
3. אחרי שהנתונים מגיעים, מפרסמים ל-production ומבקשים ממנו להתחבר עוד פעם אחת.
4. ההצלחה נמדדת כך: בתשובת הטוקן לא מופיע `refresh_token_expires_in`. אם כן, גוגל לא שחררה את ההגבלה, ונשארים במצב Testing עם חיבור מחדש פעם בשבוע.
