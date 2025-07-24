import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

// TODO: יבא את הרכיבים הנדרשים (Navbar, Footer)
// TODO: הגדר את המבנה הכללי של הדף

const Layout = () => {
  return (
    <div className="page-container">
      <NavBar />
      
      <main className="content-wrapper">
        <div className="main-container">
          <Outlet />
        </div>
      </main>
      
      {/* TODO: הוסף Footer */}
    </div>
  )
}

export default Layout
