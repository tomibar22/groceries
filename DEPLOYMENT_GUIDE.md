# 🚀 מדריך פריסה (Deployment)

מדריך מפורט לפריסת האפליקציה ל-Production.

## 📋 לפני הפריסה - Checklist

- [ ] `.env` מוגדר נכון עם Supabase credentials
- [ ] `schema.sql` רץ בהצלחה ב-Supabase
- [ ] האפליקציה עובדת ב-development mode
- [ ] אייקונים PWA קיימים בתיקיית `public/`
- [ ] נבדק על מובייל (לפחות בדפדפן)
- [ ] אין errors ב-console

## 🎯 אפשרויות פריסה

### 1️⃣ Vercel (מומלץ ביותר!)

**יתרונות:**
- ✅ פריסה מהירה ביותר
- ✅ HTTPS אוטומטי
- ✅ CDN גלובלי
- ✅ תמיכה מעולה ב-Vite
- ✅ Serverless functions (אם תרצה בעתיד)
- ✅ חינמי לפרויקטים אישיים

#### התקנה

```bash
# התקן Vercel CLI
npm install -g vercel

# התחבר לחשבון
vercel login

# פרוס!
vercel
```

#### הגדרות בפעם הראשונה

כשתריץ `vercel` לפעם הראשונה:

1. **Set up and deploy?** → Yes
2. **Which scope?** → בחר את החשבון שלך
3. **Link to existing project?** → No
4. **Project name?** → `grocery-list` (או כל שם אחר)
5. **Directory?** → `.` (Enter)
6. **Override settings?** → No

#### הוספת משתני סביבה

אפשרות א' - דרך ה-CLI:
```bash
vercel env add VITE_SUPABASE_URL
# הדבק את ה-URL ולחץ Enter

vercel env add VITE_SUPABASE_ANON_KEY
# הדבק את ה-key ולחץ Enter
```

אפשרות ב' - דרך ה-Dashboard:
1. היכנס ל-https://vercel.com/dashboard
2. בחר את הפרויקט
3. Settings → Environment Variables
4. הוסף:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
5. שמור

#### פריסה מחדש

```bash
# כל שינוי שתעשה:
vercel --prod
```

או:
```bash
# חבר ל-Git ופשוט push:
git add .
git commit -m "Update"
git push
# Vercel יפרוס אוטומטית!
```

---

### 2️⃣ Netlify

**יתרונות:**
- ✅ פשוט ונוח
- ✅ HTTPS אוטומטי
- ✅ Forms מובנים (אם תרצה feedback)
- ✅ חינמי

#### התקנה

```bash
# התקן Netlify CLI
npm install -g netlify-cli

# התחבר
netlify login

# אתחול
netlify init
```

#### הגדרות

1. **Create & configure a new site** → Yes
2. **Team?** → בחר את החשבון שלך
3. **Site name?** → `grocery-list-app` (או כל שם זמין)
4. **Build command?** → `npm run build`
5. **Publish directory?** → `dist`

#### הוספת משתני סביבה

```bash
# הוסף משתנים
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
```

או דרך ה-Dashboard:
1. https://app.netlify.com/
2. Site settings → Environment variables
3. הוסף את המשתנים

#### פריסה

```bash
netlify deploy --prod
```

---

### 3️⃣ GitHub Pages (בסיסי)

**יתרונות:**
- ✅ חינמי לחלוטין
- ✅ אינטגרציה מלאה עם GitHub

**חסרונות:**
- ⚠️ דורש קצת יותר הגדרות
- ⚠️ לא תומך ב-environment variables (צריך workaround)

#### הגדרות

1. **עדכן `vite.config.js`**:
```javascript
export default defineConfig({
  base: '/grocery-list/', // שם הריפו שלך
  // ... שאר ההגדרות
});
```

2. **התקן gh-pages**:
```bash
npm install -D gh-pages
```

3. **הוסף סקריפט ל-`package.json`**:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. **פרוס**:
```bash
npm run deploy
```

5. **הפעל GitHub Pages**:
   - Settings → Pages
   - Source: `gh-pages` branch
   - Save

**⚠️ הערה חשובה**: משתני הסביבה יהיו חשופים! לא מומלץ לפרויקטים עם מידע רגיש.

---

## 🔒 אבטחה ב-Production

### Supabase RLS (Row Level Security)

ודא ש-RLS מופעל:
```sql
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_list ENABLE ROW LEVEL SECURITY;
```

### הגבלת Domains (אופציונלי)

ב-Supabase:
1. Settings → API
2. "URL Configuration"
3. הוסף את הדומיין שלך (לדוגמה: `https://grocery-list.vercel.app`)

---

## 📊 Performance Optimization

### 1. Build Optimization

ה-`vite.config.js` כבר מוגדר אוטומטית, אבל אפשר לשפר:

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js']
        }
      }
    }
  }
});
```

### 2. Image Optimization

אם תוסיף תמונות בעתיד:
- דחוס באמצעות https://tinypng.com/
- השתמש ב-WebP במקום PNG/JPG
- הוסף lazy loading

### 3. Bundle Analysis

```bash
npm run build
npx vite-bundle-visualizer
```

---

## 🧪 בדיקות לאחר פריסה

### Lighthouse Test
1. פתח את ה-URL ב-Chrome
2. DevTools → Lighthouse
3. הרץ בדיקה (Mobile + Desktop)
4. **ציון מומלץ**:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+
   - PWA: 100

### PWA Test
1. בדוק התקנה:
   - Chrome → תפריט → "Install app"
   - ודא שהאייקון נכון
2. בדוק offline:
   - התקן את האפליקציה
   - נתק אינטרנט
   - פתח - צריך לעבוד!

### Mobile Test
1. פתח בטלפון אמיתי
2. בדוק:
   - [ ] החיפוש עובד
   - [ ] הוספת מוצרים
   - [ ] Swipe למחיקה
   - [ ] Pull to refresh
   - [ ] Real-time sync (פתח משני מכשירים)
   - [ ] Add to Home Screen

---

## 🆘 בעיות נפוצות

### 1. "Failed to fetch" / CORS errors

**פתרון**: ודא שה-domain מוגדר ב-Supabase:
- Settings → API → URL Configuration
- הוסף את ה-URL של האתר שלך

### 2. משתני סביבה לא עובדים

**פתרון**:
- ודא שהמשתנים מתחילים ב-`VITE_`
- בנה מחדש את הפרויקט
- ב-Vercel/Netlify: ודא שהוספת במקום הנכון

### 3. PWA לא מתקין

**פתרון**:
- ודא ש-`manifest.json` נגיש
- ודא שיש HTTPS (HTTP לא יעבוד!)
- בדוק שהאייקונים קיימים

### 4. Real-time לא עובד

**פתרון**:
- ודא ש-Realtime מופעל ב-Supabase (Settings → API)
- בדוק שה-RLS policies מאפשרות SELECT
- בדוק ב-Network tab אם יש WebSocket connection

---

## 📈 Monitoring

### Vercel Analytics
```bash
npm install @vercel/analytics
```

```javascript
// src/main.jsx
import { inject } from '@vercel/analytics';

inject();
```

### Sentry (Error Tracking)
```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn-here",
  environment: "production"
});
```

---

## 🎉 סיימת!

האפליקציה שלך באוויר! 🚀

**URL לדוגמה**:
- Vercel: `https://grocery-list.vercel.app`
- Netlify: `https://grocery-list-app.netlify.app`

**שתף עם השותף/ה שלך והתחל לקנות ביעילות!** 🛒
