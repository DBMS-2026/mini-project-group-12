import Sidebar from '../components/layout/Sidebar'
import PostCard from '../components/feed/PostCard'
import { Search } from 'lucide-react'

function Home() {
  const posts = [
    {
      id: 1,
      username: 'shankar_foodie',
      restaurant: 'Burger King',
      caption: 'Best burger ever 🍔',
    },
    {
      id: 2,
      username: 'pizza_lover',
      restaurant: 'Dominos',
      caption: 'Cheesy pizza heaven 🍕',
    },
    {
      id: 3,
      username: 'sweet_tooth',
      restaurant: 'Belgian Waffle',
      caption: 'Chocolate waffle time 🧇',
    },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#fef2f2] via-[#fff7ed] to-[#f3f4f6]">
      <Sidebar />

      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search restaurants, foods, creators..."
              className="w-full bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl py-4 pl-12 pr-4 shadow-lg outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-extrabold text-gray-800">
              Food Feed 🍔
            </h1>

            <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
              Trending
            </button>
          </div>

          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home