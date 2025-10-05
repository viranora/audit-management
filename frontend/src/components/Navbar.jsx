import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-bold hover:text-blue-200 transition">
            SmartSpirit CaseApp
          </Link>
          <div className="space-x-6">
            <Link to="/dashboard" className="hover:text-blue-200 transition">
              Dashboard
            </Link>
            <Link to="/users" className="hover:text-blue-200 transition">
              Kullanıcılar
            </Link>
            <Link to="/roles" className="hover:text-blue-200 transition">
              Roller
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar