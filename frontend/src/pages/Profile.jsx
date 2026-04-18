function Profile() {
  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-300"></div>

          <div>
            <h1 className="text-3xl font-bold">shankar_foodie</h1>
            <p className="text-gray-500">Food Blogger 🍔</p>
          </div>
        </div>

        <div className="flex gap-8 text-lg">
          <p><span className="font-bold">12</span> Posts</p>
          <p><span className="font-bold">250</span> Followers</p>
          <p><span className="font-bold">180</span> Following</p>
        </div>
      </div>
    </div>
  )
}

export default Profile