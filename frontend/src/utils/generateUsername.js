export const generateUsername = (fullName) => {
  if (!fullName) return ''
  const base = fullName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
  const suffix = Math.floor(Math.random() * 999)
  return `${base}_${suffix}`
}
