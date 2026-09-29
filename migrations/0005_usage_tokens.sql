-- שלב 3: טוקנים בפועל לכל יום, כדי להציג עלות משוערת באפליקציה
ALTER TABLE gemini_usage ADD COLUMN tokens_in INTEGER NOT NULL DEFAULT 0;
ALTER TABLE gemini_usage ADD COLUMN tokens_out INTEGER NOT NULL DEFAULT 0;   -- כולל טוקני חשיבה, שמחויבים כפלט
