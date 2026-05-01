function Button({
  text,
  onClick,
  type = 'button',
  variant = 'primary',
}) {
  const styles = {
    primary:
      'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-105',
    secondary:
      'bg-gray-200 text-gray-700 hover:bg-gray-300',
    dark:
      'bg-black text-white hover:bg-gray-800',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${styles[variant]}`}
    >
      {text}
    </button>
  )
}

export default Button