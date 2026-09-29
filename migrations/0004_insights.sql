-- שלב 2: תובנות יומיות. כרטיס אחד לכל נתיב (מבט אחורה, תגלית, מחקר, צעד קטן, סיכום שבוע) בכל יום.
-- ההיסטוריה של הכרטיסים והמשוב היא מה שמונע חזרות: המנוע קורא אותה כדי לדעת מה כבר הוצג ומה נחסם.

CREATE TABLE IF NOT EXISTS insight_card (
  id TEXT PRIMARY KEY,                -- '<coach_date>:<lane>'
  coach_date TEXT NOT NULL,
  lane TEXT NOT NULL,                 -- look | disc | research | move | weekly | quiet
  key TEXT NOT NULL,                  -- למשל look:caf_high, res:sleep_regularity
  topics_json TEXT NOT NULL DEFAULT '[]',   -- מזהי נושאים בספריית "למה ככה?"
  variant INTEGER NOT NULL DEFAULT 0, -- גרסת הנוסח, או אינדקס הווו במחקר היום
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  label TEXT,
  emoji TEXT,
  params_json TEXT,
  data_json TEXT,                     -- שורות סיכום שבוע, חוזק ראיות, יום במיקוד
  feedback TEXT,                      -- known | irrelevant | more
  feedback_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_insight_date ON insight_card (coach_date);
CREATE INDEX IF NOT EXISTS idx_insight_key ON insight_card (key, coach_date);

-- יום שהורכב. has_sleep=0 אומר שהורכב לפני שנתוני הלילה הגיעו, ולכן יורכב מחדש כשיגיעו (אם עוד לא ניתן משוב)
CREATE TABLE IF NOT EXISTS insight_day (
  coach_date TEXT PRIMARY KEY,
  has_sleep INTEGER NOT NULL DEFAULT 0,
  generated_at INTEGER NOT NULL,
  notes_json TEXT
);
