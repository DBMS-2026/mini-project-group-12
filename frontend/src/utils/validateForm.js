export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{3,30}$/
  return re.test(username)
}

export const validateForm = (fields) => {
  const errors = {}

  if (fields.email !== undefined && !validateEmail(fields.email)) {
    errors.email = 'Invalid email address'
  }

  if (fields.password !== undefined && !validatePassword(fields.password)) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (fields.username !== undefined && !validateUsername(fields.username)) {
    errors.username = 'Username must be 3-30 characters, letters, numbers, and underscores only'
  }

  if (fields.fullName !== undefined && !fields.fullName.trim()) {
    errors.fullName = 'Full name is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
