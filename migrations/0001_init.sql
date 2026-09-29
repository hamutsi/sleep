-- שלב 0: התחברות, חיבור ל-Google Health, שינה והתאוששות.
-- כל הנתונים האישיים יושבים כאן בלבד. הקבצים הסטטיים לא מכילים שום נתון אישי.

CREATE TABLE IF NOT EXISTS auth_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  session_version INTEGER NOT NULL DEFAULT 1,
  fails INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO auth_state (id) VALUES (1);

-- חיבור יחיד ל-Google Health. הטוקנים מוצפנים (AES-GCM) לפני הכתיבה.
CREATE TABLE IF NOT EXISTS gh_connection (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  status TEXT NOT NULL DEFAULT 'disconnected',   -- disconnected | connected | needs_reauth | profile_missing
  health_user_id TEXT,
  legacy_user_id TEXT,
  refresh_sealed TEXT,
  refresh_expires_at INTEGER,                    -- NULL אומר שאין תוקף של 7 ימים (production)
  access_sealed TEXT,
  access_expires_at INTEGER,
  granted_scopes TEXT,
  connected_at INTEGER,
  last_sync_at INTEGER,
  last_device_sync TEXT,
  device_version TEXT,
  last_error TEXT
);
INSERT OR IGNORE INTO gh_connection (id) VALUES (1);

CREATE TABLE IF NOT EXISTS oauth_state (
  state TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sleep_session (
  id TEXT PRIMARY KEY,
  night_date TEXT NOT NULL,                      -- תאריך ההשכמה (civilEndTime.date)
  start_utc TEXT NOT NULL,
  end_utc TEXT NOT NULL,
  start_offset_s INTEGER,
  end_offset_s INTEGER,
  sleep_type TEXT,
  is_main INTEGER,
  is_nap INTEGER,
  processed INTEGER,
  stages_status TEXT,
  manually_edited INTEGER,
  min_in_period INTEGER,
  min_asleep INTEGER,
  min_awake INTEGER,
  min_to_fall_asleep INTEGER,
  min_after_wake INTEGER,
  deep_min INTEGER,
  light_min INTEGER,
  rem_min INTEGER,
  awake_min INTEGER,
  awake_count INTEGER,
  efficiency_pct INTEGER,                        -- מחושב: min_asleep / min_in_period
  device TEXT,
  update_time TEXT,
  stages_json TEXT,
  raw_json TEXT,
  synced_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sleep_night ON sleep_session (night_date);

CREATE TABLE IF NOT EXISTS daily_recovery (
  date TEXT PRIMARY KEY,
  hrv_rmssd_ms REAL,
  hrv_deep_rmssd_ms REAL,
  nonrem_hr_bpm REAL,
  rhr_bpm REAL,
  spo2_avg REAL,
  spo2_low REAL,
  spo2_high REAL,
  br_bpm REAL,
  skin_nightly_c REAL,
  skin_baseline_c REAL,
  skin_sd30_c REAL,
  raw_json TEXT,
  synced_at INTEGER NOT NULL
);

-- התשובה האחרונה הגולמית מכל סוג נתון, לבדיקת מבנה. נדרסת בכל סנכרון.
CREATE TABLE IF NOT EXISTS gh_raw (
  kind TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  fetched_at INTEGER NOT NULL
);
