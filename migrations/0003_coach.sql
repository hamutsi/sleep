-- שלב 1ב: שיחה יומית עם המאמן, ותקרת קריאות יומית ל-Gemini.

-- שיחה אחת לכל יום. coach_date הוא התאריך של "יום המאמן": היום מתחיל ב-04:00 בשעון ישראל.
-- opener_status: none | running | done. ה-UNIQUE וה-running מבטיחים פתיחה אחת ליום גם עם כמה מכשירים.
CREATE TABLE IF NOT EXISTS chat_thread (
  id TEXT PRIMARY KEY,
  coach_date TEXT NOT NULL UNIQUE,
  opener_status TEXT NOT NULL DEFAULT 'none',
  opener_started_at INTEGER,
  gate_json TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_message (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  role TEXT NOT NULL,                 -- user | assistant
  text TEXT NOT NULL,
  meta_json TEXT,                     -- כללי בטיחות שהופעלו, מדדי שימוש, זמן הנתונים
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chat_msg ON chat_message (thread_id, created_at);

-- מונה קריאות ל-Gemini לפי יום. תקרה אחת מגינה גם על מכסה חינמית וגם על חשבון בתשלום.
CREATE TABLE IF NOT EXISTS gemini_usage (
  local_date TEXT PRIMARY KEY,
  calls INTEGER NOT NULL DEFAULT 0
);
