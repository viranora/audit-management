export const validatePassword = password => {
  if (!password || password.length < 8) {
    return { hasError: true, message: 'Parola en az 8 karakter olmalı' }
  }
  const hasSequentialNumbers = /\d{3}/.test(password)
  const hasSequentialLetters = /[a-zA-Z]{3}/.test(password)
  if (hasSequentialNumbers || hasSequentialLetters) {
    return { hasError: true, message: 'Parola ardışık 3 harf veya rakam içermemeli' }
  }
  return { hasError: false }
}

export const validateLogin = ({ username, password }) => {
  const errors = {}
  if (!username) errors.username = 'Kullanıcı adı gerekli'
  if (!password) errors.password = 'Parola gerekli'
  return { hasErrors: Object.keys(errors).length > 0, errors }
}