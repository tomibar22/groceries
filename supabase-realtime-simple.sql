-- ============================================
-- Supabase Realtime Setup - גרסה פשוטה
-- ============================================
-- הרץ את הסקריפט הזה ב-Supabase SQL Editor
-- ============================================

-- שלב 1: ודא ש-RLS מופעל
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_list ENABLE ROW LEVEL SECURITY;

-- שלב 2: צור policies (מחליף ישנות)
DROP POLICY IF EXISTS "Enable read access for all users" ON items;
DROP POLICY IF EXISTS "Enable insert access for all users" ON items;
DROP POLICY IF EXISTS "Enable update access for all users" ON items;
DROP POLICY IF EXISTS "Enable delete access for all users" ON items;

CREATE POLICY "Enable read access for all users" ON items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON items FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON items FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON active_list;
DROP POLICY IF EXISTS "Enable insert access for all users" ON active_list;
DROP POLICY IF EXISTS "Enable update access for all users" ON active_list;
DROP POLICY IF EXISTS "Enable delete access for all users" ON active_list;

CREATE POLICY "Enable read access for all users" ON active_list FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON active_list FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON active_list FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON active_list FOR DELETE USING (true);

-- שלב 3: הפעל Realtime
-- במקום ALTER PUBLICATION, עשה זאת דרך ה-UI:
-- Database → Replication → supabase_realtime → Edit publication
-- סמן את: items ו-active_list

-- או הרץ (אם זה לא קיים):
-- ALTER PUBLICATION supabase_realtime SET TABLE items, active_list;

-- שלב 4: בדיקה
SELECT
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('items', 'active_list')
ORDER BY tablename, policyname;

-- צריך לראות 8 policies (4 לכל טבלה)

-- ============================================
-- ✅ עכשיו:
-- 1. לך ל-Database → Replication
-- 2. לחץ על supabase_realtime
-- 3. Edit publication
-- 4. סמן: items ו-active_list
-- 5. Save
-- 6. Settings → API → ודא ש-Realtime מופעל
-- ============================================
