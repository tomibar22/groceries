# ⚡ התחלה מהירה - 5 דקות

מדריך מהיר להפעלת האפליקציה ב-5 דקות!

## 📝 מה שאתה צריך

- [ ] Node.js מותקן (בדוק: `node --version`)
- [ ] חשבון Supabase (חינמי) - https://supabase.com

## 🚀 שלבים

### 1. התקנת תלויות (30 שניות)

```bash
npm install
```

### 2. הגדרת Supabase (2 דקות)

#### 2.1 צור פרויקט
1. היכנס ל-https://app.supabase.com
2. "New Project"
3. שם: `grocery-list`
4. Password: בחר סיסמה חזקה (שמור אותה!)
5. Region: `Central EU` (או הקרוב אליך)
6. לחץ "Create new project" ו**המתן 2 דקות** (יוצר DB)

#### 2.2 הרץ Schema
1. בפרויקט Supabase → לחצן **SQL Editor** בצד
2. "New Query"
3. **העתק את כל התוכן מקובץ `schema.sql`** (Ctrl+A, Ctrl+C)
4. הדבק (Ctrl+V) ולחץ **RUN** (או F5)
5. ✅ צריך לראות: "Success. No rows returned"

#### 2.3 קבל API Keys
1. Settings (⚙️ למטה בצד) → **API**
2. העתק:
   - **Project URL** (משהו כמו `https://abcdefgh.supabase.co`)
   - **anon public** key (מחרוזת ארוכה)

### 3. הגדר משתני סביבה (30 שניות)

```bash
# צור קובץ .env
cp .env.example .env
```

**פתח את `.env`** והדבק:
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
```

**⚠️ חשוב**: החלף את `YOUR-PROJECT` ו-`YOUR-ANON-KEY` בערכים האמיתיים!

### 4. הרץ! (10 שניות)

```bash
npm run dev
```

**פתח בדפדפן**: http://localhost:5173

## ✅ בדיקה שהכל עובד

1. **הוסף מוצר**: כתוב "חלב" ולחץ Enter
2. **סמן כנקנה**: לחץ על ה-checkbox
3. **מחק**: לחץ על ה-X האדום

אם הכל עובד → **מזל טוב! 🎉**

## 📱 בדיקה על טלפון (1 דקה)

1. ודא שהמחשב והטלפון באותה WiFi
2. הרץ:
```bash
npm run dev -- --host
```
3. תראה שורה כזו:
```
➜  Network: http://192.168.1.100:5173
```
4. **פתח את ה-URL הזה בטלפון**
5. נסה להוסיף מוצר - אמור לעבוד מעולה!

## 🐛 משהו לא עובד?

### בעיה: "Missing Supabase environment variables"
**פתרון**:
- ✅ ודא שיצרת קובץ `.env` (לא `.env.example`!)
- ✅ ודא שהמשתנים מתחילים ב-`VITE_`
- ✅ הפעל מחדש: Ctrl+C ואז `npm run dev`

### בעיה: "Failed to fetch" / Connection error
**פתרון**:
- ✅ ודא ש-schema.sql רץ בהצלחה (SQL Editor → History)
- ✅ בדוק שה-URL תקין (מסתיים ב-`.supabase.co`)
- ✅ בדוק שאין רווחים או מרכאות ב-`.env`

### בעיה: המוצרים לא נשמרים
**פתרון**:
- ✅ SQL Editor → הרץ: `SELECT * FROM items;`
- ✅ אמור להחזיר טבלה (גם אם ריקה)
- ✅ אם שגיאה → הרץ שוב את `schema.sql`

### עדיין לא עובד?
1. פתח DevTools (F12)
2. לך ל-Console
3. חפש שגיאות (אדומות)
4. העתק את השגיאה וחפש בגוגל או שאל אותי!

## 📚 מה הלאה?

- 📖 קרא את [README.md](./README.md) למידע מלא
- 🎨 קרא את [ICONS_GUIDE.md](./ICONS_GUIDE.md) ליצירת אייקונים
- 🚀 קרא את [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) לפריסה

## 💡 טיפים

1. **Real-time**: פתח את האפליקציה בשני טאבים - שינויים יסתנכרנו מיידית!
2. **Pull to refresh**: משוך למטה מהחלק העליון של הרשימה
3. **Swipe to delete**: החלק שמאלה על מוצר למחיקה מהירה
4. **Autocomplete**: כשאתה כותב, תקבל הצעות מהמאגר

---

**זהו! אתה מוכן לקניות חכמות! 🛒✨**
