-- ============================================
-- Supabase Realtime Setup
-- ============================================
-- הרץ את הסקריפט הזה ב-Supabase SQL Editor
-- כדי להפעיל Realtime בצורה נכונה
-- ============================================

-- 1. ודא שהטבלאות קיימות
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('items', 'active_list');

-- אם לא מחזיר שתי שורות, הרץ את schema.sql תחילה!

-- ============================================
-- 2. הפעל Row Level Security (RLS)
-- ============================================

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_list ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. הסר policies ישנות (אם קיימות)
-- ============================================

DROP POLICY IF EXISTS "Enable read access for all users" ON items;
DROP POLICY IF EXISTS "Enable insert access for all users" ON items;
DROP POLICY IF EXISTS "Enable update access for all users" ON items;
DROP POLICY IF EXISTS "Enable delete access for all users" ON items;

DROP POLICY IF EXISTS "Enable read access for all users" ON active_list;
DROP POLICY IF EXISTS "Enable insert access for all users" ON active_list;
DROP POLICY IF EXISTS "Enable update access for all users" ON active_list;
DROP POLICY IF EXISTS "Enable delete access for all users" ON active_list;

-- ============================================
-- 4. צור policies חדשות
-- ============================================

-- Policies for items table
CREATE POLICY "Enable read access for all users" ON items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON items
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON items
    FOR DELETE USING (true);

-- Policies for active_list table
CREATE POLICY "Enable read access for all users" ON active_list
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON active_list
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON active_list
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON active_list
    FOR DELETE USING (true);

-- ============================================
-- 5. הפעל Realtime Replication
-- ============================================

-- הסר את הטבלאות מ-publication הישנה (אם קיימת)
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS items;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS active_list;

-- הוסף את הטבלאות ל-publication
ALTER PUBLICATION supabase_realtime ADD TABLE items;
ALTER PUBLICATION supabase_realtime ADD TABLE active_list;

-- ============================================
-- 6. בדוק שהכל עובד
-- ============================================

-- בדוק RLS
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('items', 'active_list')
ORDER BY tablename, policyname;

-- צריך לראות 8 policies (4 לכל טבלה)

-- בדוק Realtime Publication
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename IN ('items', 'active_list');

-- צריך לראות שתי שורות: items ו-active_list

-- ============================================
-- 7. טסט נתונים
-- ============================================

-- הוסף מוצר לדוגמה
INSERT INTO items (name) VALUES ('בדיקה')
ON CONFLICT (name) DO NOTHING;

-- קרא את כל המוצרים
SELECT * FROM items;

-- הוסף לרשימה פעילה
INSERT INTO active_list (item_id, name, quantity, purchased)
VALUES (
  (SELECT id FROM items WHERE name = 'בדיקה' LIMIT 1),
  'בדיקה',
  1,
  false
);

-- קרא רשימה פעילה
SELECT * FROM active_list;

-- נקה בדיקה
DELETE FROM active_list WHERE name = 'בדיקה';
DELETE FROM items WHERE name = 'בדיקה';

-- ============================================
-- ✅ סיימת!
-- ============================================
-- עכשיו:
-- 1. לך ל-Settings → API → Realtime וודא שמופעל
-- 2. פתח את האפליקציה ובדוק Console
-- 3. צריך לראות: "SUBSCRIBED" messages
-- ============================================
