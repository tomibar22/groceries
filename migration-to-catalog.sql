-- ============================================
-- Migration: Master Catalog Model
-- ============================================
-- שינוי מודל: מ"רשימה פעילה" ל"קטלוג קבוע"
-- ============================================

-- שלב 1: הוסף עמודת 'needed' לטבלת items
ALTER TABLE items ADD COLUMN IF NOT EXISTS needed BOOLEAN DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS purchased BOOLEAN DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- שלב 2: העבר נתונים מ-active_list ל-items (אם יש)
-- סמן את כל הפריטים ב-active_list כ-needed
UPDATE items
SET needed = true
WHERE id IN (SELECT item_id FROM active_list WHERE item_id IS NOT NULL);

-- העתק את הסטטוס purchased
UPDATE items i
SET purchased = (
  SELECT purchased
  FROM active_list al
  WHERE al.item_id = i.id
  LIMIT 1
)
WHERE id IN (SELECT item_id FROM active_list WHERE item_id IS NOT NULL);

-- העתק את הכמות
UPDATE items i
SET quantity = (
  SELECT quantity
  FROM active_list al
  WHERE al.item_id = i.id
  LIMIT 1
)
WHERE id IN (SELECT item_id FROM active_list WHERE item_id IS NOT NULL);

-- שלב 3: מחק את active_list (לא צריך יותר)
DROP TABLE IF EXISTS active_list CASCADE;

-- שלב 4: צור אינדקסים לביצועים
CREATE INDEX IF NOT EXISTS idx_items_needed ON items(needed);
CREATE INDEX IF NOT EXISTS idx_items_purchased ON items(purchased);
CREATE INDEX IF NOT EXISTS idx_items_needed_purchased ON items(needed, purchased);

-- שלב 5: עדכן trigger ל-updated_at
CREATE OR REPLACE FUNCTION update_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_items_updated_at_trigger ON items;
CREATE TRIGGER update_items_updated_at_trigger
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_items_updated_at();

-- שלב 6: עדכן publication
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS active_list;
ALTER PUBLICATION supabase_realtime ADD TABLE items;

-- שלב 7: עדכן policies (אם צריך)
DROP POLICY IF EXISTS "Enable read access for all users" ON items;
DROP POLICY IF EXISTS "Enable insert access for all users" ON items;
DROP POLICY IF EXISTS "Enable update access for all users" ON items;
DROP POLICY IF EXISTS "Enable delete access for all users" ON items;

CREATE POLICY "Enable read access for all users" ON items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON items FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON items FOR DELETE USING (true);

-- שלב 8: בדיקה
SELECT
  id,
  name,
  needed,
  purchased,
  quantity,
  created_at,
  updated_at
FROM items
ORDER BY
  needed DESC,  -- לקנייה למעלה
  purchased ASC, -- לא נקנה למעלה
  name ASC;      -- אלפביתי

-- ============================================
-- ✅ סיימת! עכשיו:
-- 1. עדכן את הקוד React להשתמש רק ב-items
-- 2. needed=true → צריך לקנות
-- 3. purchased=true → כבר נקנה
-- ============================================
