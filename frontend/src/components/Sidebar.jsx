import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const role = localStorage.getItem('role')
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', label: '🏠 Dashboard', icon: '🏠' },
    { path: '/users', label: '👥 Kullanıcılar', icon: '👥' },
    { path: '/roles', label: '🛡️ Roller', icon: '🛡️' },
  ]

  if (role === 'Admin') {
    menuItems.push({ path: '/logs', label: '📋 Loglar', icon: '📋' })
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 w-64 transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white shadow-xl border-r border-gray-200`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-600">
          <h2 className="text-xl font-bold text-white">SmartSpirit</h2>
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-red-200 text-2xl transition"
          >
            ×
          </button>
        </div>
        
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 768 && toggleSidebar()}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="font-medium">{item.label.split(' ')[1]}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar