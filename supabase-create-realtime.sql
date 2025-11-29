-- ============================================
-- יצירת Realtime Publication מאפס
-- ============================================
-- הרץ את זה ב-Supabase SQL Editor
-- ============================================

-- שלב 1: בדוק אם publication קיים
SELECT * FROM pg_publication WHERE pubname = 'supabase_realtime';

-- אם לא מחזיר שום שורה, ניצור אותו:

-- שלב 2: צור publication חדש
CREATE PUBLICATION supabase_realtime;

-- שלב 3: הוסף את הטבלאות
ALTER PUBLICATION supabase_realtime ADD TABLE items;
ALTER PUBLICATION supabase_realtime ADD TABLE active_list;

-- שלב 4: ודא ש-RLS מופעל
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_list ENABLE ROW LEVEL SECURITY;

-- שלב 5: צור policies
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

-- שלב 6: בדיקה
SELECT
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';

-- צריך להחזיר שתי שורות: items ו-active_list

-- ============================================
-- ✅ סיימת!
-- עכשיו:
-- 1. Settings → API → הפעל Realtime
-- 2. רענן את האפליקציה
-- 3. בדוק Console - צריך לראות SUBSCRIBED
-- ============================================
