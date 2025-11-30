-- ============================================
-- Add times_needed column to track how often items are marked as needed
-- ============================================

-- Add the times_needed column
ALTER TABLE items ADD COLUMN IF NOT EXISTS times_needed INTEGER DEFAULT 0;

-- Update existing items: if currently needed=true, set times_needed=1
UPDATE items SET times_needed = 1 WHERE needed = true;

-- Create index for sorting performance
CREATE INDEX IF NOT EXISTS idx_items_times_needed ON items(times_needed DESC);

-- Verification
SELECT id, name, needed, times_needed FROM items ORDER BY times_needed DESC, name ASC LIMIT 10;
