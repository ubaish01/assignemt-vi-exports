
import React from 'react'
import { Navigate } from 'react-router-dom'

const LoggedInRoute = ({ children }) => {
  const isLogin = localStorage.getItem("token")?.length>0;
  if (isLogin) return children
  return <Navigate to="/login" />
}

export default LoggedInRoute
