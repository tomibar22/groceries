# 🚀 הוראות העלאה ל-GitHub

## שלב 1: צור Repository ב-GitHub

1. היכנס ל-https://github.com
2. לחץ על "+" → "New repository"
3. מלא:
   - Repository name: `grocery-list`
   - Description: `🛒 Shared grocery shopping list app with real-time sync`
   - Public/Private: בחר
   - ⚠️ **אל** תסמן "Initialize with README"
4. לחץ "Create repository"

## שלב 2: העלה את הקוד

GitHub יציג לך מסך עם הוראות. העתק את ה-URL שמופיע (משהו כמו: `https://github.com/YOUR-USERNAME/grocery-list.git`)

### אם יש לך HTTPS:

```bash
# החלף YOUR-USERNAME בשם המשתמש שלך
git remote add origin https://github.com/YOUR-USERNAME/grocery-list.git
git branch -M main
git push -u origin main
```

### אם יש לך SSH:

```bash
# החלף YOUR-USERNAME בשם המשתמש שלך
git remote add origin git@github.com:YOUR-USERNAME/grocery-list.git
git branch -M main
git push -u origin main
```

## שלב 3: הזן את פרטי ההתחברות

- **Username**: שם המשתמש שלך ב-GitHub
- **Password**: **לא הסיסמה שלך!** אלא **Personal Access Token**

### יצירת Personal Access Token:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)"
3. שם: `grocery-list-token`
4. סמן: `repo` (כל ההרשאות של repo)
5. "Generate token"
6. **העתק את ה-token** (לא תוכל לראות אותו שוב!)
7. השתמש ב-token במקום הסיסמה

## שלב 4: ודא שהכל עלה

1. רענן את דף ה-repository ב-GitHub
2. צריך לראות את כל הקבצים!
3. ה-README יוצג אוטומטית

## לעדכונים עתידיים:

```bash
git add .
git commit -m "Your commit message"
git push
```

---

**זהו! הקוד שלך עכשיו ב-GitHub! 🎉**
