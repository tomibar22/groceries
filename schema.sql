-- ============================================
-- Grocery List App - Database Schema
-- ============================================
-- הוראות התקנה:
-- 1. היכנס ל-Supabase Dashboard
-- 2. לך ל-SQL Editor
-- 3. העתק והרץ את כל הקוד הזה
-- ============================================

-- טבלת המוצרים (מאגר קבוע)
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת הרשימה הפעילה
CREATE TABLE IF NOT EXISTS active_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  purchased BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- אינדקס לשיפור ביצועי חיפוש
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_active_list_created_at ON active_list(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_active_list_purchased ON active_list(purchased);

-- פונקציה לעדכון אוטומטי של updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- טריגר לעדכון updated_at
DROP TRIGGER IF EXISTS update_active_list_updated_at ON active_list;
CREATE TRIGGER update_active_list_updated_at
    BEFORE UPDATE ON active_list
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- הגדרת Row Level Security (RLS)
-- ============================================
-- הפעלת RLS על הטבלאות
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_list ENABLE ROW LEVEL SECURITY;

-- מדיניות גישה - כרגע כולם יכולים לקרוא ולכתוב
-- (אפשר להוסיף authentication מאוחר יותר)
CREATE POLICY "Enable read access for all users" ON items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON items
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON items
    FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON active_list
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON active_list
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON active_list
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON active_list
    FOR DELETE USING (true);

-- ============================================
-- נתוני דוגמה (אופציונלי)
-- ============================================
-- מוצרים ראשוניים לדוגמה
INSERT INTO items (name) VALUES
  ('חלב'),
  ('לחם'),
  ('ביצים'),
  ('גבינה צהובה'),
  ('עגבניות'),
  ('מלפפון'),
  ('תפוחים'),
  ('בננות'),
  ('יוגורט'),
  ('חומוס')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- בדיקה שהכל עובד
-- ============================================
-- הצג את כל המוצרים במאגר
SELECT * FROM items ORDER BY created_at DESC;

-- הצג את הרשימה הפעילה
SELECT * FROM active_list ORDER BY created_at DESC;
