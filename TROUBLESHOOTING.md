# 🔧 פתרון בעיות (Troubleshooting)

מדריך מקיף לפתרון בעיות נפוצות.

## 🚨 בעיות נפוצות

### 1. האפליקציה לא מתחברת ל-Supabase

**סימפטומים**:
- "Missing Supabase environment variables"
- "Failed to fetch"
- "Connection error"

**פתרונות**:

#### בדיקה 1: קובץ .env קיים?
```bash
ls -la .env
```
אם לא קיים:
```bash
cp .env.example .env
```

#### בדיקה 2: ערכים נכונים ב-.env?
פתח את `.env` ובדוק:
```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co  ✅
VITE_SUPABASE_ANON_KEY=eyJ...  ✅
```

❌ שגיאות נפוצות:
```env
# חסרות המרכאות או יש רווחים
VITE_SUPABASE_URL= https://abcdefgh.supabase.co  ❌
VITE_SUPABASE_URL="https://abcdefgh.supabase.co"  ❌
```

#### בדיקה 3: הפעל מחדש את שרת הפיתוח
```bash
# עצור את השרת (Ctrl+C)
# הפעל מחדש:
npm run dev
```

#### בדיקה 4: נקה cache
```bash
rm -rf node_modules/.vite
npm run dev
```

---

### 2. המוצרים לא נשמרים / "relation does not exist"

**סימפטומים**:
- מוצרים נעלמים אחרי refresh
- שגיאה: "relation 'items' does not exist"
- שגיאה: "relation 'active_list' does not exist"

**פתרונות**:

#### בדיקה 1: הטבלאות קיימות?
1. פתח Supabase Dashboard
2. Table Editor
3. ודא שיש טבלאות: `items` ו-`active_list`

אם לא → רוץ `schema.sql` שוב:

#### בדיקה 2: הרץ Schema מחדש
1. Supabase → SQL Editor
2. New Query
3. העתק **הכל** מ-`schema.sql`
4. הדבק
5. **RUN** (או F5)
6. ודא: "Success. No rows returned"

#### בדיקה 3: בדוק Policies (RLS)
```sql
-- הרץ ב-SQL Editor:
SELECT * FROM items;
SELECT * FROM active_list;
```

אם שגיאת הרשאות → הפעל RLS policies:
```sql
-- העתק מ-schema.sql את החלק של Policies והרץ שוב
```

---

### 3. Real-time לא עובד

**סימפטומים**:
- שינויים לא מסתנכרנים בין טאבים
- צריך לרענן ידנית כדי לראות עדכונים

**פתרונות**:

#### בדיקה 1: Realtime מופעל ב-Supabase?
1. Supabase → Settings → API
2. גלול ל-"Realtime"
3. ודא שהמתג **מופעל** (Enable Realtime)

#### בדיקה 2: WebSocket מתחבר?
1. פתח DevTools (F12)
2. Network tab
3. Filter: WS (WebSocket)
4. רענן את הדף
5. צריך לראות connection ל-`wss://...supabase.co/realtime/...`

אם אין → בדוק firewall/proxy

#### בדיקה 3: בדוק שגיאות בקונסול
```bash
# DevTools → Console
# חפש שגיאות אדומות הקשורות ל-realtime
```

#### בדיקה 4: RLS Policies מאפשרות SELECT?
```sql
-- SQL Editor:
-- ודא שיש policy כזו:
CREATE POLICY "Enable read access for all users" ON items
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON active_list
    FOR SELECT USING (true);
```

---

### 4. Autocomplete לא עובד / אין הצעות

**סימפטומים**:
- כותב בשדה החיפוש ואין הצעות
- הצעות לא מדויקות

**פתרונות**:

#### בדיקה 1: יש מוצרים במאגר?
```sql
-- SQL Editor:
SELECT * FROM items;
```

אם ריק → הוסף מוצרים:
```sql
INSERT INTO items (name) VALUES
  ('חלב'),
  ('לחם'),
  ('ביצים');
```

#### בדיקה 2: Fuse.js נטען?
```bash
# DevTools → Console:
console.log(window.Fuse)
# צריך להדפיס: function Fuse...
```

אם undefined → בעיית import:
```bash
npm install fuse.js --save
```

#### בדיקה 3: בדוק בקונסול
כותב בשדה החיפוש ובדוק Console - אמור להדפיס מערך של תוצאות

---

### 5. PWA לא מתקין / "Add to Home Screen" לא מופיע

**סימפטומים**:
- אין אפשרות להתקנה
- אייקון ההתקנה לא מופיע

**פתרונות**:

#### בדיקה 1: HTTPS?
PWA עובד **רק** ב-HTTPS (או localhost)
- ✅ `https://...` או `http://localhost`
- ❌ `http://192.168...` (לא יעבוד!)

#### בדיקה 2: Manifest תקין?
1. DevTools → Application → Manifest
2. בדוק שכל השדות מלאים:
   - name ✅
   - short_name ✅
   - icons ✅
   - start_url ✅
   - display: standalone ✅

#### בדיקה 3: אייקונים קיימים?
```bash
ls -la public/icon-*.png
```

צריך לראות:
- icon-192x192.png
- icon-512x512.png

אם חסר → ראה [ICONS_GUIDE.md](./ICONS_GUIDE.md)

#### בדיקה 4: Service Worker רץ?
1. DevTools → Application → Service Workers
2. צריך לראות service worker פעיל

אם לא → build מחדש:
```bash
npm run build
npm run preview
```

---

### 6. האפליקציה איטית על מובייל

**סימפטומים**:
- טעינה ארוכה
- אנימציות קופצות
- גלילה לא חלקה

**פתרונות**:

#### בדיקה 1: Production build?
Development mode איטי יותר:
```bash
npm run build
npm run preview
```

#### בדיקה 2: Lighthouse Score
1. DevTools → Lighthouse
2. Device: Mobile
3. Run
4. בדוק ציונים

אם Performance < 90:
- בדוק Network tab - יש קבצים כבדים?
- בדוק Console - יש שגיאות?

#### בדיקה 3: Supabase Region
בחר region קרוב אליך:
- ישראל → Europe (Frankfurt) או Central EU
- לא US East!

#### בדיקה 4: Image Optimization
אם הוספת תמונות:
- דחוס עם https://tinypng.com/
- השתמש ב-WebP
- הוסף lazy loading

---

### 7. "CORS error" / "Access-Control-Allow-Origin"

**סימפטומים**:
- שגיאת CORS בקונסול
- Request נכשל

**פתרונות**:

#### בדיקה 1: URL נכון ב-.env?
```env
# צריך להיות ה-URL המלא:
VITE_SUPABASE_URL=https://abcdefgh.supabase.co  ✅

# לא כך:
VITE_SUPABASE_URL=abcdefgh  ❌
```

#### בדיקה 2: Domain מורשה?
ב-production:
1. Supabase → Settings → API
2. "URL Configuration"
3. הוסף את ה-domain שלך

---

### 8. Swipe to Delete לא עובד

**סימפטומים**:
- החלקה שמאלה לא מוחקת מוצר
- המוצר לא זז

**פתרונות**:

#### בדיקה 1: על מובייל אמיתי?
Swipe gestures לא עובדים טוב ב-DevTools emulator.
נסה על טלפון אמיתי.

#### בדיקה 2: החלקה מספיק ארוכה?
צריך להחליק לפחות 100px שמאלה.
נסה החלקה מהירה יותר.

---

### 9. Pull to Refresh לא עובד

**סימפטומים**:
- משיכה למטה לא מרעננת

**פתרונות**:

#### בדיקה 1: בתחילת הדף?
Pull to refresh עובד רק כש-scroll נמצא בראש הדף (position: 0)

#### בדיקה 2: על מובייל אמיתי?
לא עובד ב-DevTools - נסה על טלפון.

---

### 10. הכמות לא משתנה

**סימפטומים**:
- לוחץ +/- והכמות לא משתנה

**פתרונות**:

#### בדיקה 1: בדוק Console
```bash
# DevTools → Console
# חפש שגיאות כשלוחצים על +/-
```

#### בדיקה 2: RLS Policy מאפשר UPDATE?
```sql
-- SQL Editor:
CREATE POLICY "Enable update access for all users" ON active_list
    FOR UPDATE USING (true);
```

---

## 🆘 עדיין לא עובד?

### Debug Mode

הפעל debug mode:

```javascript
// src/supabaseClient.js
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    },
    log_level: 'debug'  // הוסף את זה!
  }
});
```

עכשיו תראה logs מפורטים בקונסול.

### בדוק שגיאות ב-Supabase

1. Supabase Dashboard
2. Database → Logs
3. חפש errors
4. בדוק timestamps

### צור Issue ב-GitHub

אם כלום לא עזר:
1. פתח issue ב-GitHub
2. כלול:
   - תיאור הבעיה
   - צילומי מסך
   - שגיאות מה-Console
   - גרסאות: `node --version`, `npm --version`

### שאל בקהילה

- Stack Overflow: `[react] [supabase] [vite]`
- Supabase Discord: https://discord.supabase.com
- Reddit: r/reactjs, r/Supabase

---

## 📊 כלי Debug שימושיים

### Chrome DevTools

```bash
# פתח DevTools
F12 (Windows/Linux)
Cmd+Option+I (Mac)

# Console: Ctrl+Shift+J
# Network: Ctrl+Shift+E
# Application: לבדיקת PWA, Storage, Service Workers
```

### Supabase Logs

```bash
# Real-time connections:
Supabase Dashboard → Database → Replication → Realtime

# SQL Queries:
Supabase Dashboard → Database → Query Performance
```

### React DevTools

```bash
# התקן extension:
Chrome Web Store → "React Developer Tools"

# שימוש:
DevTools → Components / Profiler
```

---

**אם עדיין לא מצאת פתרון - נשמח לעזור! פתח issue או צור קשר.**
