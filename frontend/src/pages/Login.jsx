import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { validateLogin } from '../utils/validators'

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Hata mesajını temizle
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const validation = validateLogin(form)
    if (validation.hasErrors) {
      setErrors(validation.errors)
      return
    }
    try {
      await loginUser(form)
      navigate('/dashboard')
    } catch (err) {
      setErrors({ general: 'Giriş başarısız. Kullanıcı adı veya parola hatalı.' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Giriş Yap</h2>
        
        <div>
          <input 
            name="username" 
            placeholder="Kullanıcı Adı" 
            value={form.username}
            onChange={handleChange} 
            className={`w-full p-3 border rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <input 
            name="password" 
            type="password" 
            placeholder="Parola" 
            value={form.password}
            onChange={handleChange} 
            className={`w-full p-3 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Giriş Yap
        </button>
        
        {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
      </form>
    </div>
  )
}

export default Login