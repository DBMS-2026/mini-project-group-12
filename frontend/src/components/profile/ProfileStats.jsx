function ProfileStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg text-center">
        <h2 className="text-3xl font-bold text-red-500">24</h2>
        <p className="text-gray-500 mt-2">Posts</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg text-center">
        <h2 className="text-3xl font-bold text-orange-500">1.2K</h2>
        <p className="text-gray-500 mt-2">Followers</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg text-center">
        <h2 className="text-3xl font-bold text-red-500">380</h2>
        <p className="text-gray-500 mt-2">Following</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg text-center">
        <h2 className="text-3xl font-bold text-orange-500">54</h2>
        <p className="text-gray-500 mt-2">Saved</p>
      </div>
    </div>
  )
}

export default ProfileStats