import React, { useState } from 'react'
import Modal from '../components/Modal'
import { refreshToken } from '../services/api'

const RefreshToken = ({ onClose }) => {
  const [message, setMessage] = useState('')

  const handleRefresh = async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken')
    if (refreshTokenValue) {
      try {
        const res = await refreshToken(refreshTokenValue)
        localStorage.setItem('token', res.data)
        setMessage('Token başarıyla yenilendi')
      } catch {
        setMessage('Token yenileme hatası')
      }
    } else {
      setMessage('Refresh token bulunamadı')
    }
  }

  return (
    <Modal title="🔁 Token Yenile" onClose={onClose}>
      <button onClick={handleRefresh} className="w-full bg-green-600 text-white p-2 rounded">Yenile</button>
      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </Modal>
  )
}

export default RefreshToken