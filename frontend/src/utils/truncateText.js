function truncateText(text, limit = 100) {
  if (text.length <= limit) return text

  return text.slice(0, limit) + '...'
}

export default truncateText