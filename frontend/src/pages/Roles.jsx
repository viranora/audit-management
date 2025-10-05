import React, { useEffect, useState } from 'react'
import { getRoles } from '../services/api'

const Roles = () => {
  const [roles, setRoles] = useState([])
  const role = localStorage.getItem('role')

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const res = await getRoles()
      setRoles(res.data)
    } catch (err) {
      console.error('Roller yüklenemedi:', err)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛡️ ROLLER</h2>
        {role === 'Admin' && (
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ➕ Yeni Rol
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(r => (
          <div key={r.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {r.name === 'Admin' ? '👑' : '👤'}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{r.name}</h3>
                  <p className="text-sm text-gray-600">
                    {r.name === 'Admin' ? 'Sistem Yöneticisi' : 'Normal Kullanıcı'}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p><strong>Yetkiler:</strong></p>
              <ul className="list-disc list-inside mt-1">
                {r.name === 'Admin' ? (
                  <>
                    <li>Tüm kullanıcıları görüntüleme</li>
                    <li>Kullanıcı ekleme/düzenleme/silme</li>
                    <li>Logları görüntüleme</li>
                    <li>Rol yönetimi</li>
                  </>
                ) : (
                  <>
                    <li>Kendi profilini görüntüleme</li>
                    <li>Kendi bilgilerini düzenleme</li>
                    <li>Rolleri görüntüleme</li>
                  </>
                )}
              </ul>
            </div>

            {role === 'Admin' && (
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                  ✏️ Düzenle
                </button>
                {r.name !== 'Admin' && (
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                    🗑️ Sil
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Roles