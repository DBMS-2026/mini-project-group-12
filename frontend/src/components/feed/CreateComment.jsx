import { useState } from 'react'
import { Send } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

function CreateComment({ onSubmit }) {
  const { darkMode } = useTheme()
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 mt-4">
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`flex-1 rounded-2xl px-5 py-3 text-sm outline-none border transition-all duration-200 ${
          darkMode
            ? 'bg-white/5 border-white/5 text-gray-200 placeholder:text-gray-600 focus:border-orange-500/30'
            : 'bg-gray-100 border-gray-100 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-300'
        }`}
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all"
      >
        <Send size={20} />
      </button>
    </form>
  )
}

export default CreateComment
