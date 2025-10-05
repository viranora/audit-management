import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Logs from './pages/Logs'
import Roles from './pages/Roles'
import Users from './pages/Users'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  )
}

export default App