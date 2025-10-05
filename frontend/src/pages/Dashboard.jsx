import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import UserMenu from '../components/UserMenu'
import { useNavigate } from 'react-router-dom'
import { updateUser } from '../services/api'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileForm, setProfileForm] = useState({
    email: '',
    phone: ''
  })
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/')
    setProfileForm({
      email: localStorage.getItem('email') || '',
      phone: localStorage.getItem('phone') || ''
    })
  }, [navigate])

  const handleProfileChange = e => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handleProfileSave = async e => {
    e.preventDefault()
    if (!profileForm.email || !profileForm.phone) {
      setProfileError('Email ve telefon zorunlu!')
      return
    }
    try {
      await updateUser({
        username: localStorage.getItem('username'),
        email: profileForm.email,
        phone: profileForm.phone
      })
      setProfileSuccess(true)
      setProfileError('')
      localStorage.setItem('email', profileForm.email)
      localStorage.setItem('phone', profileForm.phone)
      setTimeout(() => setShowProfileModal(false), 1000)
    } catch {
      setProfileError('Bilgiler güncellenemedi!')
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-blue-400 text-white px-3 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          ☰
        </button>
      )}
      <div className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300">
        <div className="flex justify-end mb-4">
          <UserMenu />
        </div>
        <h1 className="text-2xl font-bold mb-4">Hoş geldin, {localStorage.getItem('username')}</h1>
        <p className="text-gray-600">Sol panelden modüllere erişebilirsin.</p>
        {localStorage.getItem('role') !== 'Admin' && (
          <div className="mt-8">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowProfileModal(true)}
            >
              Profilimi Düzenle
            </button>
          </div>
        )}
      </div>

      {/* Profil Düzenle Modali */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleProfileSave}
            className="bg-white rounded shadow-lg w-full max-w-md p-6 relative"
          >
            <button
              onClick={() => setShowProfileModal(false)}
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Profil Bilgilerini Güncelle</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Email:</label>
                <input
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Telefon:</label>
                <input
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {profileError && <div className="text-red-600">{profileError}</div>}
              {profileSuccess && <div className="text-green-600">Bilgiler güncellendi!</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded mt-2"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Dashboard