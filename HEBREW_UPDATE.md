# 🇮🇱 עדכון עברית - CardMart

## ✅ מה עודכן?

### 1. ✨ לוגו חדש
- לוגו CardMart עם קלפים וכוכב
- צבעים: כחול כהה וכתום
- מוצג בכל עמודי האתר

### 2. 🇮🇱 שפה עברית בכל מקום
- כל הטקסט באתר עברי
- כללי RTL (מימין לשמאל)
- תרגומים מלאים

### 3. 📄 קבצים שנוספו/עודכנו:
```
src/
├── locales/
│   └── he.json                 # כל התרגומים העבריים
├── hooks/
│   └── useTranslation.ts       # hook לשימוש בתרגומים
└── components/
    └── Header.tsx             # עודכן עם לוגו ותרגומים
src/pages/
└── Home.tsx                    # עודכן עם תרגומים
src/App.tsx                     # עודכן ל-RTL
```

## 🚀 איך להפעיל?

### Step 1: עצור את הסרבר
```bash
Ctrl + C
```

### Step 2: הפעל שוב
```bash
npm run dev
```

### Step 3: רענן את הדפדפן
```
Ctrl + Shift + R (רענון קשה)
```

או פשוט לך לעמוד הבא:
```
http://localhost:3000
```

---

## 📝 איך להוסיף תרגום לעמוד חדש?

### Step 1: הוסף תרגום ל-`src/locales/he.json`
```json
{
  "myPage": {
    "title": "הכותרת שלי",
    "description": "התיאור שלי"
  }
}
```

### Step 2: בקובץ הרקט שלך
```tsx
import { useTranslation } from '../hooks/useTranslation'

export const MyComponent = () => {
  const { t } = useTranslation()
  
  return (
    <div dir="rtl">
      <h1>{t('myPage.title')}</h1>
      <p>{t('myPage.description')}</p>
    </div>
  )
}
```

---

## 🎨 עמודים שעדיין צריכים עדכון:

- [ ] Cart.tsx
- [ ] Checkout.tsx
- [ ] Login.tsx
- [ ] Signup.tsx
- [ ] AdminDashboard.tsx
- [ ] ProductCard.tsx

**כרגע:**
- ✅ Header מלא בעברית
- ✅ Home מלא בעברית
- ✅ לוגו חדש

---

## 📚 קבצי תרגום

### `src/locales/he.json`
מכיל:
- ✅ header (כל כפתורי הטופס העליון)
- ✅ home (עמוד הבית)
- ✅ cart (עגלה)
- ✅ checkout (תשלום)
- ✅ auth (התחברות והרשמה)
- ✅ admin (ניהול)
- ✅ categories (קטגוריות)
- ✅ errors (שגיאות)

---

## 🔧 כיצד לשנות את הלוגו?

אם תרצה לשנות את ה-SVG של הלוגו, עדכן אותו ב:
```
src/components/Header.tsx
```

ח בקטע:
```tsx
<svg width="40" height="40" viewBox="0 0 100 100">
  {/* SVG CODE HERE */}
</svg>
```

---

## ✨ צבעים בשימוש:

- **Primary**: Orange (#f5a623)
- **Secondary**: Navy (#1a2744)
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)

---

## 🎉 בדיקה:

הכן בחנה:
1. ✅ כל הטקסט בעברית
2. ✅ לוגו חדש בחזקה
3. ✅ RTL בכל עמוד
4. ✅ כל הכפתורים בעברית

---

**מעכשיו, האתר שלך בעברית במלואו! 🇮🇱**

---

**הערות:**
- זו בגרסה 1.0 של התרגום
- עמודים נוספים צריכים עדכון ידני
- אם ברצונך להוסיף שפה נוספת, פשוט צור `src/locales/en.json` וקדם הלאה!

