# פרויקט גמר - Full Stack Application

פרויקט זה הוא שלד לפרויקט גמר המשלב React עם Vite בצד הלקוח ו-Node.js עם MongoDB בצד השרת.

## טכנולוגיות

### Client (Frontend)
- **React 18** - ספריית UI
- **Vite** - Build tool מהיר
- **CSS Modules / Styled Components** - עיצוב
- **Axios** - HTTP requests
- **React Router** - ניווט

### Server (Backend)
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - מסד נתונים
- **Mongoose** - ODM למונגו
- **JWT** - אימות משתמשים
- **bcrypt** - הצפנת סיסמאות

## התקנה והרצה

### התקנה מהירה של כל הפרויקט
```bash
npm run install-all
```

### הרצה במצב פיתוח
```bash
npm run dev
```

### בניית הפרויקט לייצור
```bash
npm run build
```

### הרצה בייצור
```bash
npm start
```

## מבנה הפרויקט

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # רכיבי UI
│   │   ├── pages/         # דפי האפליקציה
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API calls
│   │   ├── utils/         # פונקציות עזר
│   │   ├── context/       # React Context
│   │   └── styles/        # קבצי CSS
│   └── public/            # קבצים סטטיים
│
├── server/                # Node.js backend
│   ├── controllers/       # Logic controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── middleware/       # Express middleware
│   ├── config/           # הגדרות
│   ├── utils/            # פונקציות עזר
│   └── services/         # Business logic
│
└── docs/                 # תיעוד

```

## פיצ'רים בסיסיים

- ✅ מערכת משתמשים (הרשמה/התחברות)
- ✅ CRUD operations
- ✅ אימות ואבטחה
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation

## התחלת עבודה

1. שכפל את הפרויקט
2. הריץ `npm run install-all`
3. הגדר משתני סביבה ב-`server/.env`
4. הריץ `npm run dev`
5. התחל לפתח!

## משתני סביבה

צור קובץ `.env` בתיקיית `server` עם המשתנים הבאים:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/graduation-project
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## תרומה לפרויקט

1. צור branch חדש
2. בצע את השינויים
3. הוסף tests אם נדרש
4. צור Pull Request

## רישיון

MIT License
