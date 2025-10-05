import React, { useState } from 'react'
import ChangePassword from '../pages/ChangePassword'
import RefreshToken from '../pages/RefreshToken'
import Modal from './Modal'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/api'

const UserMenu = () => {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(null)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const navigate = useNavigate()

  const handleLogoutConfirmed = async () => {
    try {
      await logoutUser()
    } catch (err) {
      console.log('Logout API hatası:', err)
    } finally {
      localStorage.clear()
      navigate('/')
    }
  }

  const closeMenu = () => {
    setOpen(false)
  }

  const openModal = (tab) => {
    setActiveTab(tab)
    setOpen(false)
  }

  return (
    <div className="relative">
      {/* Kullanıcı butonu */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors"
      >
        <span className="text-lg">👤</span>
        <span className="font-medium text-gray-800">
          {localStorage.getItem('username') || 'Kullanıcı'}
        </span>
        <span className="text-sm">▼</span>
      </button>

      {/* Açılır menü */}
      {open && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeMenu}
          />
          <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-48 z-20 border border-gray-200">
            <div className="py-2">
              <button
                onClick={() => openModal('password')}
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <span className="mr-2">🔒</span>
                Parola Değiştir
              </button>

              <button
                onClick={() => openModal('token')}
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <span className="mr-2">🔁</span>
                Token Yenile
              </button>

              <hr className="my-1" />

              <button
                onClick={() => setConfirmLogout(true)}
                className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
              >
                <span className="mr-2">🚪</span>
                Çıkış Yap
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modaller */}
      {activeTab === 'password' && (
        <ChangePassword onClose={() => setActiveTab(null)} />
      )}

      {activeTab === 'token' && (
        <RefreshToken onClose={() => setActiveTab(null)} />
      )}

      {confirmLogout && (
        <Modal title="🚪 Oturumu Kapat" onClose={() => setConfirmLogout(false)}>
          <div className="space-y-4">
            <p className="text-gray-700">
              Oturumu kapatmak istediğinizden emin misiniz?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmLogout(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Vazgeç
              </button>
              <button
                onClick={handleLogoutConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Evet, Çıkış Yap
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default UserMenu