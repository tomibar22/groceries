-- ============================================
-- בדיקת Realtime - Debug
-- ============================================
-- הרץ את זה כדי לבדוק מה הבעיה
-- ============================================

-- 1. בדוק שה-publication קיים
SELECT * FROM pg_publication WHERE pubname = 'supabase_realtime';
-- צריך להחזיר שורה אחת

-- 2. בדוק אילו טבלאות ב-publication
SELECT
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
-- צריך להחזיר: items ו-active_list

-- 3. בדוק את ה-publication settings
SELECT
  pubname,
  pubinsert,
  pubupdate,
  pubdelete,
  pubtruncate
FROM pg_publication
WHERE pubname = 'supabase_realtime';
-- הכל צריך להיות 't' (true)

-- 4. בדוק RLS
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('items', 'active_list');
-- rowsecurity צריך להיות 't' (true)

-- 5. בדוק Policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('items', 'active_list')
ORDER BY tablename, cmd;
-- צריך לראות policies ל-SELECT, INSERT, UPDATE, DELETE

-- ============================================
-- אם הכל נראה תקין, הבעיה היא ב-Realtime setting
-- לך ל-Settings → API → Realtime וודא שזה מופעל
-- ============================================

-- ============================================
-- תיקון: אם ה-publication לא מחזיר כלום
-- ============================================

-- אם שלב 2 לא מחזיר טבלאות, הרץ:
-- ALTER PUBLICATION supabase_realtime SET TABLE items, active_list;

-- ============================================
-- תיקון: אם ה-publication events לא מופעלים
-- ============================================

-- אם שלב 3 מחזיר 'f' (false) ב-pubinsert/pubupdate/pubdelete, הרץ:
-- ALTER PUBLICATION supabase_realtime SET (publish = 'insert, update, delete');
