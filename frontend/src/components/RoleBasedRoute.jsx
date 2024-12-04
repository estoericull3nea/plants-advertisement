import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

// Custom Hook to Get the User Role from LocalStorage or Decoding Token
const useRole = () => {
  const [role, setRole] = useState(null)

  useEffect(() => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token') // Assuming JWT is stored in 'token'

    if (token) {
      try {
        // Decode the token to get the user role
        const decoded = jwtDecode(token)
        setRole(decoded.role)
      } catch (error) {
        console.error('Error decoding token:', error)
        setRole(null)
      }
    }
  }, [])

  return role
}

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const role = useRole()
  const navigate = useNavigate()

  useEffect(() => {
    if (role && !allowedRoles.includes(role)) {
      navigate('/')
    }
  }, [role, allowedRoles, navigate])

  if (role === null) {
    return <div>Loading...</div>
  }

  return allowedRoles.includes(role) ? children : null
}

export default RoleBasedRoute
