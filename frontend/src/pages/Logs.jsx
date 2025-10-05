import React, { useEffect, useState } from 'react'
import { getUserLogs, getErrorLogs } from '../services/api'

const logTypes = {
  LOGIN: { label: 'Başarılı Giriş', color: 'bg-green-100 border-green-500', icon: '✅' },
  PASSWORD_CHANGE: { label: 'Parola Değişimi', color: 'bg-yellow-100 border-yellow-500', icon: '🔒' },
  LOGOUT: { label: 'Çıkış Yapıldı', color: 'bg-red-100 border-red-500', icon: '🚪' },
  TOKEN_REFRESH: { label: 'Token Yenilendi', color: 'bg-blue-100 border-blue-500', icon: '🔁' },
}

const Logs = () => {
  const [userLogs, setUserLogs] = useState([])
  const [errorLogs, setErrorLogs] = useState([])
  const [activeTab, setActiveTab] = useState('user')
  const role = localStorage.getItem('role')

  useEffect(() => {
    if (role === 'Admin') {
      loadUserLogs()
      loadErrorLogs()
    }
  }, [role])

  const loadUserLogs = async () => {
    try {
      const data = await getUserLogs()
      setUserLogs(data)
    } catch (err) {
      console.error('Kullanıcı logları yüklenemedi:', err)
    }
  }

  const loadErrorLogs = async () => {
    try {
      const data = await getErrorLogs()
      setErrorLogs(data)
    } catch (err) {
      console.error('Hata logları yüklenemedi:', err)
    }
  }

  if (role !== 'Admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya yalnızca Admin rolüne sahip kullanıcılar erişebilir.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 LOGLAR</h2>
      
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('user')}
            className={`py-2 px-4 ${activeTab === 'user' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            Kullanıcı Logları ({userLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('error')}
            className={`py-2 px-4 ${activeTab === 'error' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            Hata Logları ({errorLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'user' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userLogs.map(log => {
            const typeInfo = logTypes[log.action] || {
              label: log.action,
              color: 'bg-gray-100 border-gray-500',
              icon: 'ℹ️',
            }

            return (
              <div
                key={log.id}
                className={`p-4 rounded-lg shadow-md border-l-4 ${typeInfo.color}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{typeInfo.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{typeInfo.label}</h3>
                    <p className="text-sm text-gray-600">{log.username}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <p><strong>Tarih:</strong> {new Date(log.timestamp).toLocaleString('tr-TR')}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'error' && (
        <div className="space-y-4">
          {errorLogs.map(log => (
            <div key={log.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <span className="text-2xl text-red-500">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-700 mb-2">{log.type}</h3>
                  <p className="text-gray-700 mb-3">{log.message}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Tarih:</strong> {new Date(log.createdDate).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Logs