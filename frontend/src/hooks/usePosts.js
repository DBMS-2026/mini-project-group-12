import { useContext } from 'react'
import { PostContext } from '../context/PostContext'

function usePosts() {
  return useContext(PostContext)
}

export default usePosts