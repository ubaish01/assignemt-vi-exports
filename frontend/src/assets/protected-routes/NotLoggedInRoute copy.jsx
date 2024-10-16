
import React from 'react'
import { Navigate } from 'react-router-dom'

const NotLoggedInRoute = ({ children }) => {
    const isLogin = localStorage.getItem("token")?.length>0;
  if (isLogin) return <Navigate to="/" />
  return children
}

export default NotLoggedInRoute
