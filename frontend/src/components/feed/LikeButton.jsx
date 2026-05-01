import { Heart } from 'lucide-react'
import { useState } from 'react'

function LikeButton() {
  const [liked, setLiked] = useState(false)

  return (
    <button
      onClick={() => setLiked(!liked)}
      className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all ${
        liked
          ? 'bg-red-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-red-50'
      }`}
    >
      <Heart
        size={20}
        fill={liked ? 'white' : 'none'}
      />
      Like
    </button>
  )
}

export default LikeButton