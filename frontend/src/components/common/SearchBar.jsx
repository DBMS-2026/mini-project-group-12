import { Search } from 'lucide-react'

function SearchBar() {
  return (
    <div className="relative w-full">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search restaurants, foods, creators..."
        className="w-full rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-300 px-12 py-4 outline-none focus:ring-2 focus:ring-red-400"
      />
    </div>
  )
}

export default SearchBar