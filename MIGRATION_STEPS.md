# 🔄 שלבי המעבר למודל "קטלוג קבוע"

## שלב 1: הרץ Migration SQL ✅

**כבר עשית**: הרץ את `migration-to-catalog.sql` ב-Supabase SQL Editor

זה עשה:
- ✅ הוסיף עמודות `needed`, `purchased`, `quantity` ל-`items`
- ✅ מחק את `active_list` (לא צריך יותר)
- ✅ עדכן publication ל-Realtime
- ✅ יצר אינדקסים

---

## שלב 2: עדכן את הקוד React

**עכשיו**: אני מעדכן את הקבצים הבאים:

1. `src/App.jsx` - לוגיקה חדשה
2. `src/components/SearchBar.jsx` - תמיכה בחיפוש
3. `src/components/ItemCard.jsx` - checkbox במקום X
4. CSS files - עיצוב מעודכן

---

## שלב 3: Push ל-GitHub & Deploy

```bash
git add .
git commit -m "Migrate to Master Catalog model"
git push
```

Netlify יעשה deploy אוטומטי.

---

## המודל החדש:

### טבלה אחת: `items`

```sql
id          UUID
name        TEXT
needed      BOOLEAN  -- צריך לקנות?
purchased   BOOLEAN  -- נקנה?
quantity    INTEGER
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### מיון אוטומטי:

```sql
ORDER BY
  needed DESC,      -- לקנייה למעלה
  purchased ASC,    -- לא נקנה למעלה
  name ASC          -- אלפביתי
```

### אינטראקציה:

- **Checkbox**: סימון = נקנה
- **+/- buttons**: שינוי כמות
- **החיפוש**: מסנן מהרשימה הקיימת

---

**ממשיך עכשיו לעדכן את הקוד...**
