// PrivateRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode' // Correct import for jwt-decode
import { toast } from 'react-hot-toast'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  let isAuthenticated = false
  let isTokenExpired = false

  if (token) {
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000 // Convert to seconds
      isAuthenticated = true
      isTokenExpired = decoded.exp < currentTime
    } catch (error) {
      console.error('Token decode error:', error)
    }
  }

  if (!isAuthenticated || isTokenExpired) {
    toast.error(
      'You must be logged in or your session has expired. Please log in again.'
    )
    return <Navigate to='/login' />
  }

  return children
}

export default PrivateRoute
