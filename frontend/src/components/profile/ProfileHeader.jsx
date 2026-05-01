function ProfileHeader({ user }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[35px] shadow-2xl border border-white/30 p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center text-white text-4xl font-bold">
          {user.name.charAt(0)}
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800">
            {user.name}
          </h1>

          <p className="text-gray-500 text-lg mt-2">
            @{user.username}
          </p>

          <p className="text-gray-600 mt-4">
            {user.bio}
          </p>

          <div className="flex flex-wrap gap-4 mt-5">
            <span className="bg-gray-100 px-4 py-2 rounded-xl text-gray-700">
              {user.email}
            </span>

            <span className="bg-gray-100 px-4 py-2 rounded-xl text-gray-700">
              {user.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader