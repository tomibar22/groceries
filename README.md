# 🛒 רשימת קניות משותפת

אפליקציית web מותאמת למובייל לניהול רשימת קניות משותפת לזוג, בהשראת Listonic.

## ✨ תכונות עיקריות

### ליבה
- **מאגר מוצרים חכם**: כל מוצר שנוסף פעם אחת נשמר לצמיתות במסד הנתונים
- **רשימה פעילה**: מה שצריך לקנות עכשיו - מוצרים חדשים עולים לראש הרשימה
- **חיפוש והוספה מהירה**:
  - Autocomplete חכם עם הצעות מהמאגר
  - Fuzzy search (סובלנות לטעויות כתיב) באמצעות Fuse.js
  - הוספת מוצרים חדשים אוטומטית
- **סנכרון Real-time**: שינויים מסתנכרנים מיידית בין כל המשתמשים דרך Supabase
- **ניהול הרשימה**:
  - סימון מוצר כ"נקנה" עם checkbox גדול
  - עריכת כמות (x1, x2, x3...)
  - מחיקת מוצרים מהרשימה (לא מהמאגר)
  - ניקוי כל המוצרים שנקנו בלחיצה אחת

### מותאם למובייל 📱
- **כפתורים גדולים**: מינימום 48x48px (Apple/Google guidelines)
- **Pull to refresh**: משיכה למטה לרענון
- **Swipe gestures**: החלקה שמאלה למחיקת מוצר
- **Haptic feedback**: רטט קל בלחיצה על checkbox (אם נתמך)
- **Sticky header**: שדה החיפוש תמיד למעלה
- **PWA**: אפשרות להתקין כאפליקציה על המסך הבית
- **עבודה offline**: תמיכה בעבודה ללא אינטרנט (סנכרון אוטומטי)
- **RTL Support**: תמיכה מלאה בעברית

## 🚀 טכנולוגיות

- **Frontend**: React 18 + Vite
- **Backend/Database**: Supabase (PostgreSQL + Realtime + Auth)
- **Styling**: CSS טהור (ללא frameworks)
- **Fuzzy Search**: Fuse.js
- **PWA**: vite-plugin-pwa

## 📋 דרישות מקדימות

- Node.js 16+ ו-npm
- חשבון Supabase (חינמי)

## 🔧 התקנה

### 1. שכפול הפרויקט
```bash
cd groceries
```

### 2. התקנת תלויות
```bash
npm install
```

### 3. הגדרת Supabase

#### 3.1 יצירת פרויקט Supabase
1. היכנס ל-https://supabase.com
2. לחץ על "New Project"
3. בחר שם, סיסמה ואזור (בחר אזור קרוב אליך לביצועים טובים)

#### 3.2 יצירת Database Schema
1. בפרויקט Supabase, לך ל-**SQL Editor**
2. לחץ על "New Query"
3. העתק את כל התוכן מקובץ `schema.sql`
4. הדבק ב-SQL Editor ולחץ על **Run**
5. ודא שהטבלאות נוצרו בהצלחה (תראה הודעה ירוקה)

#### 3.3 קבלת API Keys
1. לך ל-**Settings** → **API**
2. העתק את:
   - `Project URL`
   - `anon public` key

#### 3.4 הגדרת משתני סביבה
1. צור קובץ `.env` בשורש הפרויקט:
```bash
cp .env.example .env
```

2. פתח את `.env` והדבק את הערכים:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. הרצת האפליקציה

#### Development mode
```bash
npm run dev
```

האפליקציה תהיה זמינה ב-`http://localhost:5173`

#### Production build
```bash
npm run build
npm run preview
```

## 📱 בדיקה על מובייל

### בדיקה על רשת מקומית (אותה WiFi)

1. הרץ את האפליקציה:
```bash
npm run dev -- --host
```

2. תקבל כתובת IP כמו `http://192.168.1.100:5173`

3. פתח את הכתובת בדפדפן של הטלפון

### בדיקה עם Chrome DevTools

1. פתח Chrome DevTools (F12)
2. לחץ על אייקון המכשירים (Toggle device toolbar) או Ctrl+Shift+M
3. בחר מכשיר (iPhone, Pixel, וכו')
4. בדוק:
   - Touch interactions
   - Swipe gestures
   - Responsive design
   - Performance

### בדיקת PWA

1. ב-Chrome על מובייל:
   - פתח את האפליקציה
   - לחץ על תפריט (⋮)
   - בחר "Add to Home screen"
   - לחץ על האייקון החדש במסך הבית

2. בדיקת offline:
   - פתח את האפליקציה
   - הפעל Airplane mode
   - ודא שהאפליקציה עדיין עובדת (עם cache)

## 🎨 עיצוב ו-UI

### צבעים
- **Primary**: גרדיאנט סגול-כחול (#667eea → #764ba2)
- **Background**: לבן על כרטיסיות
- **Success**: ירוק (#48bb78)
- **Danger**: אדום (#f56565)

### גדלי Touch Targets
- **Minimum**: 48x48px
- **Search input**: 56px גובה
- **Checkboxes**: 32x32px
- **Buttons**: 48x48px

### אנימציות
- כל האנימציות ב-60fps
- שימוש ב-CSS transforms (לא margin/padding)
- Transitions עדינים (0.2s-0.3s)

## 📂 מבנה הפרויקт

```
groceries/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── robots.txt            # SEO
│   ├── _headers              # Security headers
│   └── [icons]               # יש להוסיף אייקונים
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx     # שדה חיפוש והצעות
│   │   ├── SearchBar.css
│   │   ├── ActiveList.jsx    # רשימת המוצרים
│   │   ├── ActiveList.css
│   │   ├── ItemCard.jsx      # כרטיס מוצר בודד
│   │   └── ItemCard.css
│   ├── App.jsx               # קומפוננטה ראשית
│   ├── App.css
│   ├── main.jsx              # Entry point
│   ├── index.css             # Styles גלובליים
│   └── supabaseClient.js     # Supabase configuration
├── schema.sql                # Database schema
├── .env.example              # דוגמה למשתני סביבה
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔒 אבטחה

- **Row Level Security (RLS)**: מופעל על כל הטבלאות
- **HTTPS Only**: אכיפה בייצור
- **Environment Variables**: מפתחות API נשמרים ב-.env (לא ב-git)
- **Input Validation**: כל הקלטים מאומתים לפני שליחה ל-DB

## 🚢 פריסה (Deployment)

### Vercel (מומלץ)

1. התקן Vercel CLI:
```bash
npm i -g vercel
```

2. הרץ:
```bash
vercel
```

3. הוסף משתני סביבה ב-Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Netlify

1. התקן Netlify CLI:
```bash
npm i -g netlify-cli
```

2. הרץ:
```bash
netlify init
```

3. הוסף משתני סביבה ב-Netlify Dashboard

### הערות לפריסה
- ודא ש-build command הוא `npm run build`
- ודא ש-publish directory הוא `dist`
- הוסף את משתני הסביבה בפורטל הפריסה

## 📊 Database Schema

### טבלת `items` (מאגר המוצרים)
```sql
id          UUID PRIMARY KEY
name        TEXT UNIQUE NOT NULL
created_at  TIMESTAMP
```

### טבלת `active_list` (הרשימה הפעילה)
```sql
id          UUID PRIMARY KEY
item_id     UUID → items(id)
name        TEXT NOT NULL
quantity    INTEGER DEFAULT 1
purchased   BOOLEAN DEFAULT FALSE
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

## 🎯 תהליך הוספת מוצר

1. משתמש מתחיל לכתוב בשדה החיפוש
2. Fuse.js מציע מוצרים מהמאגר (עם סובלנות לטעויות)
3. הצעות מוצגות בכרטיסיות גדולות
4. **אם לוחץ על הצעה** → מוסיף לרשימה הפעילה בלבד
5. **אם לוחץ Enter ללא בחירה**:
   - בודק אם המוצר קיים במאגר (case-insensitive)
   - אם לא קיים → מוסיף גם למאגר וגם לרשימה הפעילה
   - אם קיים → מוסיף רק לרשימה הפעילה
6. שדה החיפוש מתרוקן וחוזר ל-focus
7. המוצר מופיע בראש הרשימה

## 🐛 בעיות נפוצות

### האפליקציה לא מתחברת ל-Supabase
- ✅ ודא ש-`.env` קיים ומכיל ערכים תקינים
- ✅ ודא ש-URL מתחיל ב-`https://` ומסתיים ב-`.supabase.co`
- ✅ נסה לרענן את הדף או להפעיל מחדש את שרת הפיתוח

### Real-time לא עובד
- ✅ ודא ש-Realtime מופעל בפרויקט Supabase (Settings → API → Realtime)
- ✅ בדוק ש-RLS policies מוגדרות נכון
- ✅ פתח את DevTools ובדוק אם יש שגיאות ב-Console

### המוצרים לא נשמרים
- ✅ ודא ש-schema.sql רץ בהצלחה
- ✅ בדוק שהטבלאות קיימות ב-Table Editor
- ✅ בדוק שה-RLS policies מאפשרות INSERT/UPDATE

### האפליקציה איטית על מובייל
- ✅ הפעל production build (`npm run build && npm run preview`)
- ✅ בדוק את Lighthouse score ב-DevTools
- ✅ ודא שהשרת קרוב גיאוגרפית (Supabase region)

## 🎓 למידה נוספת

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Fuse.js Documentation](https://fusejs.io)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

## 📝 רישיון

MIT License - משתמש חופשי לכל מטרה!

## 🤝 תרומה

Pull requests מתקבלים בברכה! לכל שאלה או בעיה, פתח issue.

---

**נבנה עם ❤️ למען קניות יעילות יותר**
