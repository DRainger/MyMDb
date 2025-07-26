import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="page-container bg-primary">
      <NavBar />
      
      <main className="content-wrapper">
        <div className="main-container">
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout
