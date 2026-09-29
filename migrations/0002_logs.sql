-- שלב 1א: פרופיל, אוכל ושתייה, אימונים, בדיקת בוקר ובדיקות דם.
-- תאריך ושעה נשמרים כפי שהמשתמש רואה אותם בשעון ישראל (local_date, local_time), וגם כזמן מוחלט (ts) לחישובי מרחק בין אירועים.

CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  json TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER
);
INSERT OR IGNORE INTO profile (id) VALUES (1);

-- ארוחות, נשנושים ומשקאות (קפה, תה, אלכוהול). source: photo | text | quick
CREATE TABLE IF NOT EXISTS meal (
  id TEXT PRIMARY KEY,
  ts INTEGER NOT NULL,
  local_date TEXT NOT NULL,
  local_time TEXT NOT NULL,
  kind TEXT NOT NULL,                 -- meal | snack | drink
  name TEXT NOT NULL,
  note TEXT,
  kcal INTEGER,
  protein_g REAL,
  carbs_g REAL,
  sugar_g REAL,
  fiber_g REAL,
  fat_g REAL,
  sat_fat_g REAL,
  caffeine_mg INTEGER,
  alcohol_g REAL,                     -- גרמי אתנול טהור
  glycemic_load TEXT,                 -- low | medium | high (הערכה)
  items_json TEXT,
  confidence TEXT,
  source TEXT NOT NULL,
  thumb_b64 TEXT,                     -- תמונה ממוזערת בלבד, התמונה המלאה לא נשמרת
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_meal_date ON meal (local_date, ts);

CREATE TABLE IF NOT EXISTS workout (
  id TEXT PRIMARY KEY,
  ts_start INTEGER NOT NULL,
  local_date TEXT NOT NULL,
  local_time TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  type TEXT NOT NULL,                 -- weights | cardio | walk | other
  rpe INTEGER,                        -- 1 עד 10
  note TEXT,
  source TEXT NOT NULL,               -- manual | wearable
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_workout_date ON workout (local_date, ts_start);

-- בדיקת בוקר: איך מרגישים, בלחיצה אחת
CREATE TABLE IF NOT EXISTS checkin (
  local_date TEXT PRIMARY KEY,
  rested INTEGER,                     -- 1 עד 5
  stress INTEGER,                     -- 1 עד 5
  note TEXT,
  created_at INTEGER NOT NULL
);

-- בדיקות דם. values_json: מערך של {key, name, value, unit, ref_low, ref_high, lab_flag}
CREATE TABLE IF NOT EXISTS lab_panel (
  id TEXT PRIMARY KEY,
  collected_on TEXT NOT NULL,
  source TEXT,
  values_json TEXT NOT NULL,
  lab_notes_json TEXT,
  created_at INTEGER NOT NULL
);
