# 🔧 תיקון Netlify - משתני סביבה

## הבעיה
```
Missing Supabase environment variables!
supabaseUrl is required.
```

## הפתרון - הוסף משתני סביבה ב-Netlify

### אפשרות 1: דרך Netlify Dashboard (מומלץ)

1. **היכנס ל-Netlify**: https://app.netlify.com
2. **בחר את האתר שלך**: `benalonbar.netlify.app`
3. **לך ל-Site settings**
4. **Environment variables** (בצד שמאל)
5. **לחץ "Add a variable"**

**הוסף שני משתנים:**

#### משתנה 1:
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://your-project.supabase.co` (ה-URL מ-Supabase)
- **Scopes**: סמן "Production", "Deploy Previews", "Branch deploys"

#### משתנה 2:
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJ...` (ה-anon key מ-Supabase)
- **Scopes**: סמן "Production", "Deploy Previews", "Branch deploys"

6. **שמור**
7. **Redeploy**: Deploys → Trigger deploy → "Deploy site"

---

### אפשרות 2: דרך Netlify CLI

```bash
# התקן Netlify CLI (אם עוד לא מותקן)
npm install -g netlify-cli

# התחבר
netlify login

# הוסף משתני סביבה
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key-here"

# Deploy מחדש
netlify deploy --prod
```

---

### איפה למצוא את הערכים?

1. **Supabase Dashboard**: https://app.supabase.com
2. **בחר את הפרויקט שלך**
3. **Settings** → **API**
4. **העתק**:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## ✅ אחרי ההגדרה

1. Netlify → Deploys → "Trigger deploy"
2. המתן לסיום ה-deploy (~1 דקה)
3. פתח את האתר מחדש
4. ✅ האפליקציה אמורה לעבוד!

---

## 🔍 בדיקה שהכל עובד

1. פתח את האתר: https://benalonbar.netlify.app
2. פתח DevTools (F12) → Console
3. **לא צריך לראות שגיאות אדומות**
4. נסה להוסיף מוצר
5. ✅ אם עובד → הצלחת!
