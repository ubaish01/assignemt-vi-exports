import {
    BarChart2,
    ChevronDown,
    Home,
    Layout,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    User,
    X,
    Bell,
    Store
  } from 'lucide-react'
  import React, { useEffect, useRef, useState } from 'react'
  import { Link, useLocation, useNavigate } from 'react-router-dom'
  import logo from '../assets/react.svg'
  import profile from '../assets/avatar.jpg'
import toast from 'react-hot-toast'
import useNotifications from '../hooks/use-notifications'
  
  const routes = [
    {
      label: 'Tenders',
      path: '/',
      icon: Store
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: BarChart2
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: Layout
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: Settings
    }
  ]
  
  const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isMenuVisible, setMenuVisible] = useState(false)
    const [isNotificationOpen, setNotificationOpen] = useState(false)
    const {notifications,newNotificationsCount} = useNotifications()
    const navigate = useNavigate();
    const isLogin = localStorage.getItem("token")?.length>0;
    const user = JSON.parse(localStorage.getItem("user"));

    const menuRef = useRef(null)
    const sidebarRef = useRef(null)
    const notificationRef = useRef(null) // Reference for the notification modal
    const location = useLocation()
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Close user menu if clicked outside
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuVisible(false)
        }
        // Close sidebar if clicked outside and it's mobile
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target) &&
          window.innerWidth < 640
        ) {
          setIsSidebarOpen(false)
        }
        // Close notification modal if clicked outside
        if (
          notificationRef.current &&
          !notificationRef.current.contains(event.target)
        ) {
          setNotificationOpen(false)
        }
      }
  
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
  
    // Notification count (for badge)
    const notificationCount = notifications?.length || 0

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login")
        setMenuVisible(false)
    }

    if(!isLogin)return null
  
    return (
      <>
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity duration-300" />
        )}
  
        {/* Navbar */}
        <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:hidden"
                >
                  {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <Link to="/" className="flex items-center ml-2 sm:ml-0 space-x-3 group">
                  <img
                    src={"https://viexports.com/wp-content/uploads/2023/09/Untitled-design-18.jpg"}
                    className="w-28 transition-transform  duration-700"
                    alt="Logo"
                  />
                </Link>
              </div>
  
              {/* Right Icons (Notification & User Menu) */}
              <div className="flex items-center space-x-4">
                {/* Notification Icon */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!isNotificationOpen)}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <Bell className="w-6 h-6" />
                    {newNotificationsCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {newNotificationsCount}
                      </span>
                    )}
                  </button>
  
                  {/* Notifications Modal */}
                  {isNotificationOpen && (
                    <div
                      ref={notificationRef} // Ref for detecting clicks outside of the modal
                      className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="py-2 max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => {
                          // Check if the notification is new (created within the last 3 minutes)
                          const now = new Date();
                          const notificationTime = new Date(notification.createdAt);
                          const timeDiffInMinutes = (now - notificationTime) / (1000 * 60);
                          const isNew = timeDiffInMinutes < 3;

                          return (
                            <Link
                              to={`/bids/${notification?.tender?._id}`}
                              key={notification._id}
                            >
                              <div
                                onClick={() => setNotificationOpen(false)}
                                className={`px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 ${isNew ? 'font-bold bg-gray-100' : ''
                                  }`}
                              >
                                {notification.content} 
                              </div>
                            </Link>
                          )
                        })
                      ) : (
                        <div className="px-4 py-2.5 text-sm text-gray-700">
                          No new notifications
                        </div>
                      )}
                      </div>
                    </div>
                  )}
                </div>
  
                {/* User Menu */}
                <div ref={menuRef} className="relative">
                  <button
                    onClick={() => setMenuVisible(!isMenuVisible)}
                    className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <img
                      className="w-8 h-8 rounded-full ring-2 ring-indigo-500 object-cover"
                      src={profile}
                      alt="User"
                    />
                    <span className="hidden capitalize sm:block text-sm font-medium text-gray-700">
                      {user?.role||"ubaish"}
                    </span>
                    <ChevronDown className="hidden sm:block w-4 h-4 text-gray-500" />
                  </button>
  
                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-200 ${
                      isMenuVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="px-4 py-3 bg-gray-50">
                      <p className="text-sm font-semibold capitalize text-gray-900">{user?.role||"Ubaish"}</p>
                      <p className="text-sm text-gray-600">{user?.username}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-500" />
                        Profile
                      </Link>
                      <button
                      onClick={handleLogout}
                
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut  className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
  
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform duration-300 ease-in-out transform bg-white border-r border-gray-200 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
        >
          <div className="h-full px-4 py-6 overflow-y-auto">
            <ul className="space-y-1.5">
              {routes.map((route) => {
                const Icon = route.icon
                const isActive = location.pathname === route.path
                return (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                        isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-indigo-600' : 'text-gray-500'
                        }`}
                      />
                      <span className="font-medium">{route.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </>
    )
  }
  
  export default Navbar