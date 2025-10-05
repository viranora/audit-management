import React, { useState } from 'react'
import { validatePassword } from '../utils/validators'
import Modal from '../components/Modal'
import { changePassword } from '../services/api'

const ChangePassword = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('Parolalar eşleşmiyor')
      return
    }

    const validation = validatePassword(newPassword)
    if (validation.hasError) {
      setError(validation.message)
      return
    }

    try {
      await changePassword(newPassword)
      setSuccess(true)
      setError('')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError('Parola değiştirilemedi. Lütfen tekrar deneyin.')
    }
  }

  return (
    <Modal title="🔒 Parola Değiştir" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Yeni Parola"
            value={newPassword}
            onChange={e => {
              setNewPassword(e.target.value)
              setError('')
            }}
            className="w-full p-3 border rounded focus:border-blue-500 outline-none"
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Yeni Parola (Tekrar)"
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value)
              setError('')
            }}
            className="w-full p-3 border rounded focus:border-blue-500 outline-none"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          disabled={success}
        >
          {success ? 'Değiştirildi!' : 'Parolayı Değiştir'}
        </button>
        
        {success && (
          <p className="text-green-600 text-sm bg-green-50 p-2 rounded text-center">
            ✅ Parola başarıyla değiştirildi!
          </p>
        )}
      </form>
    </Modal>
  )
}

export default ChangePassword