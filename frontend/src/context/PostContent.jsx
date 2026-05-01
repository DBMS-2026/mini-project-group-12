import { createContext, useState } from 'react'

export const PostContext = createContext()

function PostProvider({ children }) {
  const [posts, setPosts] = useState([])

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  )
}

export default PostProvider