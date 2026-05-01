import { Bookmark } from 'lucide-react'
import { useState } from 'react'

function SaveButton() {
  const [saved, setSaved] = useState(false)

  return (
    <button
      onClick={() => setSaved(!saved)}
      className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all ${
        saved
          ? 'bg-black text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Bookmark
        size={20}
        fill={saved ? 'white' : 'none'}
      />
      Save
    </button>
  )
}

export default SaveButton