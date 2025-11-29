# 🔍 בדיקת Realtime - צ'קליסט מהיר

## ✅ מה שכבר אישרנו:
- ✅ Subscriptions: SUBSCRIBED
- ✅ Policies: 8 policies תקינות
- ✅ RLS: מופעל

## 🎯 עכשיו צריך לבדוק:

### 1. האם הטבלאות ב-publication?

הרץ ב-SQL Editor:
```sql
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

**מה צריך לראות:**
```
schemaname | tablename
-----------+-----------
public     | items
public     | active_list
```

**אם לא רואה את זה** → הרץ:
```sql
ALTER PUBLICATION supabase_realtime SET TABLE items, active_list;
```

---

### 2. האם ה-events מופעלים ב-publication?

הרץ:
```sql
SELECT
  pubname,
  pubinsert,
  pubupdate,
  pubdelete
FROM pg_publication
WHERE pubname = 'supabase_realtime';
```

**מה צריך לראות:**
```
pubname           | pubinsert | pubupdate | pubdelete
------------------+-----------+-----------+----------
supabase_realtime | t         | t         | t
```

**אם רואה `f` באחד מהם** → הרץ:
```sql
ALTER PUBLICATION supabase_realtime SET (publish = 'insert, update, delete');
```

---

### 3. האם Realtime API מופעל?

1. **Supabase Dashboard** → **Settings** → **API**
2. גלול ל-**"Realtime"**
3. ודא שהמתג **ירוק (ON)**

---

### 4. בדיקה ידנית בקונסול

פתח את האפליקציה ובדוק:

1. **Console** צריך להראות:
   ```
   📡 Active list subscription status: SUBSCRIBED
   ✅ Successfully subscribed to active_list changes
   ```

2. **הוסף מוצר חדש**

3. **Console צריך להראות**:
   ```
   ✅ Real-time change detected: INSERT {payload...}
   ```

**אם לא רואה את השורה השלישית** → הבעיה היא ב-publication!

---

## 🔧 תיקון מהיר - אם עדיין לא עובד:

הרץ את 3 השורות האלה ב-SQL Editor:

```sql
-- 1. הפעל events
ALTER PUBLICATION supabase_realtime SET (publish = 'insert, update, delete');

-- 2. וודא שהטבלאות שם
ALTER PUBLICATION supabase_realtime SET TABLE items, active_list;

-- 3. בדוק
SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

צריך להחזיר `items` ו-`active_list`.

---

## ✅ אחרי התיקון:

1. **רענן את האפליקציה** (Ctrl+Shift+R)
2. **פתח DevTools → Console**
3. **פתח בשני טאבים**
4. **הוסף מוצר בטאב 1**
5. **בטאב 2 תראה**:
   - Console: `✅ Real-time change detected`
   - המוצר מופיע אוטומטית! 🎉

---

**הרץ את שלב 1 ו-2 למעלה ותגיד לי מה התוצאות!**
