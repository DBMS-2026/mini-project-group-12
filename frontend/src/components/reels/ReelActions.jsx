import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MapPin,
} from 'lucide-react'
import { useState } from 'react'

function ReelActions() {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <div className="absolute right-6 bottom-10 flex flex-col items-center gap-5">
      <button
        onClick={() => setLiked(!liked)}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
          liked
            ? 'bg-red-500 text-white'
            : 'bg-white/20 backdrop-blur-lg text-white'
        }`}
      >
        <Heart
          size={22}
          fill={liked ? 'white' : 'none'}
        />
      </button>

      <button className="p-4 rounded-full bg-white/20 backdrop-blur-lg text-white shadow-lg">
        <MessageCircle size={22} />
      </button>

      <button
        onClick={() => setSaved(!saved)}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
          saved
            ? 'bg-black text-white'
            : 'bg-white/20 backdrop-blur-lg text-white'
        }`}
      >
        <Bookmark
          size={22}
          fill={saved ? 'white' : 'none'}
        />
      </button>

      <button className="p-4 rounded-full bg-white/20 backdrop-blur-lg text-white shadow-lg">
        <Share2 size={22} />
      </button>

      <button className="p-4 rounded-full bg-orange-500 text-white shadow-lg">
        <MapPin size={22} />
      </button>
    </div>
  )
}

export default ReelActions