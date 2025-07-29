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
import AllMovies from '../pages/AllMovies'
import MovieDetails from '../pages/MovieDetails'
import NotFound from '../pages/NotFound'
import { ProtectedRoute, PublicRoute } from './RouteGuards'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="search" element={<MovieSearch />} />
        <Route path="watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path="movies" element={<AllMovies />} />
        <Route path="movie/:imdbId" element={<MovieDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
