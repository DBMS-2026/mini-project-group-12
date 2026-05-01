function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-lg outline-none focus:ring-2 focus:ring-red-400"
    />
  )
}

export default Input