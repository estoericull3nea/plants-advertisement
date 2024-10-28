// ProtectedRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  let isAuthenticated = false

  if (token) {
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000
      isAuthenticated = decoded.exp > currentTime
    } catch (error) {
      console.error('Token decode error:', error)
    }
  }

  return isAuthenticated ? <Navigate to='/' /> : children
}

export default ProtectedRoute
