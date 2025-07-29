import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthLoader } from './routes/RouteGuards'
import ErrorBoundary from './components/ErrorBoundary'
import AppRoutes from './routes/AppRoutes'

// TODO: יבא את הרכיבים והדפים הנדרשים
// TODO: הגדר routing עם React Router
// TODO: הגדר מערכת אימות
// TODO: הוסף לוגיקת הגנה על routes פרטיים

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthLoader>
          <AppRoutes />
        </AuthLoader>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
