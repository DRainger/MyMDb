import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import MovieSearch from '../pages/MovieSearch'
import Watchlist from '../pages/Watchlist'
import Recommendations from '../pages/Recommendations'
import NotFound from '../pages/NotFound'
import { AuthLoader } from './RouteGuards'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<AuthLoader><Dashboard /></AuthLoader>} />
        <Route path="profile" element={<AuthLoader><Profile /></AuthLoader>} />
        <Route path="search" element={<MovieSearch />} />
        <Route path="watchlist" element={<AuthLoader><Watchlist /></AuthLoader>} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
