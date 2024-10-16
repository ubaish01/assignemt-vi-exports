
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Tenders from './components/Tenders'
import LoggedInRoute from './protected-routes/LoggedInRoute'
import NotLoggedInRoute from './protected-routes/NotLoggedInRoute copy'
import BiddingPage from './components/Bidding'
import { Toaster } from 'react-hot-toast'

const loggedInRoutes = [
  {
    path: '/',
    element: <Tenders />
  },
  {
    path: '/bids/:tenderId',
    element: <BiddingPage />
  },
  
]

const notLoggedInRoutes = [
  {
    path: '/login',
    element: <Login />
  }
]

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster/>
      <Routes>
        {/* LOGGED IN USERS ROUTES  */}
        {loggedInRoutes?.map((r, index) => (
          <Route
            path={r.path}
            key={index}
            element={
              <div className="pt-14 sm:ml-56 bg-gray-200">
                <LoggedInRoute>{r.element}</LoggedInRoute>
              </div>
            }
          />
        ))}

        {/* NOT LOGGED IN USERS ROUTES  */}
        {notLoggedInRoutes?.map((r, index) => (
          <Route
            path={r.path}
            key={index}
            element={
              <div className="  bg-gray-200">
                <NotLoggedInRoute>{r.element}</NotLoggedInRoute>
              </div>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default Router
