import { useState } from 'react'

function useReels() {
  const [reels, setReels] = useState([])

  return {
    reels,
    setReels,
  }
}

export default useReels