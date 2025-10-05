import React, { useEffect, useState } from 'react'
import { getUsers, addUser, updateUserAdmin, updateUser, deleteUser, markUserInactive } from '../services/api'
import Modal from '../components/Modal'

const Users = () => {
  const [users, setUsers] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    username: '', password: '', email: '', phone: '', status: 'Active', role: 'NormalUser'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const role = localStorage.getItem('role')
  const currentUser = localStorage.getItem('username')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getUsers()
      console.log('Kullanıcılar yüklendi:', data) // Debug için
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Kullanıcılar yüklenemedi:', err)
      setError('Kullanıcılar yüklenirken bir hata oluştu.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Filtreleme: Admin tüm kullanıcıları, normal kullanıcı sadece kendisini görür
  const filteredUsers = role === 'Admin' 
    ? users 
    : users.filter(u => u.username === currentUser)

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      await addUser(newUser)
      setShowAddModal(false)
      setNewUser({ username: '', password: '', email: '', phone: '', status: 'Active', role: 'NormalUser' })
      loadUsers()
    } catch (err) {
      alert('Kullanıcı eklenemedi: ' + (err.response?.data || err.message))
    }
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    try {
      if (role === 'Admin') {
        await updateUserAdmin(editingUser)
      } else {
        await updateUser({
          username: editingUser.username,
          email: editingUser.email,
          phone: editingUser.phone
        })
      }
      setShowEditModal(false)
      setEditingUser(null)
      loadUsers()
    } catch (err) {
      alert('Kullanıcı güncellenemedi: ' + (err.response?.data || err.message))
    }
  }

  const handleDeleteUser = async (username) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteUser(username)
        loadUsers()
      } catch (err) {
        alert('Kullanıcı silinemedi: ' + (err.response?.data || err.message))
      }
    }
  }

  const handleMarkInactive = async (username) => {
    if (window.confirm('Bu kullanıcıyı pasife almak istediğinizden emin misiniz?')) {
      try {
        await markUserInactive(username)
        loadUsers()
      } catch (err) {
        alert('Kullanıcı pasife alınamadı: ' + (err.response?.data || err.message))
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kullanıcılar yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadUsers}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          👥 KULLANICILAR ({filteredUsers.length})
        </h2>
        {role === 'Admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            ➕ Yeni Kullanıcı
          </button>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Henüz kullanıcı bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(u => (
            <div
              key={u.id}
              className={`p-6 rounded-lg shadow-md transition-all ${
                u.status === 'Inactive' || u.status === 'Passive' 
                  ? 'bg-red-50 border-l-4 border-red-500' 
                  : 'bg-white hover:shadow-lg'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {u.username}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    u.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {u.status}
                  </span>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {u.role?.name || u.role}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="w-4">📧</span>
                  <span className="ml-2">{u.email || 'Belirtilmemiş'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4">📱</span>
                  <span className="ml-2">{u.phone || 'Belirtilmemiş'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setEditingUser({...u})
                    setShowEditModal(true)
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
                >
                  ✏️ Düzenle
                </button>
                
                {role === 'Admin' && (
                  <>
                    {u.status === 'Active' && (
                      <button
                        onClick={() => handleMarkInactive(u.username)}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition text-sm"
                      >
                        🚫 Pasife Al
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteUser(u.username)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                    >
                      🗑️ Sil
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yeni Kullanıcı Modalı */}
      {showAddModal && (
        <Modal title="➕ Yeni Kullanıcı Ekle" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddUser} className="space-y-4">
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              className="w-full p-3 border rounded focus:border-blue-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Parola"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              className="w-full p-3 border rounded focus:border-blue-500 outline-none"
              required
            />
            <input
              type="email"
              placeholder="E-posta"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="w-full p-3 border rounded focus:border-blue-500 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Telefon"
              value={newUser.phone}
              onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              className="w-full p-3 border rounded focus:border-blue-500 outline-none"
              required
            />
            <select
              value={newUser.status}
              onChange={(e) => setNewUser({...newUser, status: e.target.value})}
              className="w-full p-3 border rounded focus:border-blue-500 outline-none"
            >
              <option value="Active">Aktif</option>
              <option value="Inactive">Pasif</option>
            </select>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              className="w-full p-3 border rounded focus:border-blue-500 outline-none"
            >
              <option value="NormalUser">Normal Kullanıcı</option>
              <option value="Admin">Admin</option>
            </select>
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
            >
              Kullanıcı Ekle
            </button>
          </form>
        </Modal>
      )}

      {/* Düzenleme Modalı */}
      {showEditModal && editingUser && (
        <Modal title="✏️ Kullanıcı Düzenle" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEditUser} className="space-y-4">
            <input
              type="email"
              placeholder="E-posta"
              value={editingUser.email || ''}
              onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
              className="w-full p-3 border rounded focus:border-blue-500 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Telefon"
              value={editingUser.phone || ''}
              onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
              className="w-full p-3 border rounded focus:border-blue-500 outline-none"
              required
            />
            {role === 'Admin' && (
              <>
                <select
                  value={editingUser.status || 'Active'}
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  className="w-full p-3 border rounded focus:border-blue-500 outline-none"
                >
                  <option value="Active">Aktif</option>
                  <option value="Inactive">Pasif</option>
                </select>
                <select
                  value={editingUser.role?.name || editingUser.role || 'NormalUser'}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full p-3 border rounded focus:border-blue-500 outline-none"
                >
                  <option value="NormalUser">Normal Kullanıcı</option>
                  <option value="Admin">Admin</option>
                </select>
              </>
            )}
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            >
              Güncelle
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Users