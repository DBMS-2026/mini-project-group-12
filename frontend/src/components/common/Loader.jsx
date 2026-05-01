function Loader({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

  return (
    <div className={`${sizes[size]} rounded-full border-3 border-transparent border-t-red-500 border-r-orange-500 animate-spin`}
      style={{ borderWidth: '3px' }}
    />
  )
}

export default Loader