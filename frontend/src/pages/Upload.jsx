function Upload() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Upload Food Post</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Caption"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Restaurant Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Google Maps Link"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex items-center justify-center text-gray-500">
            Upload Image / Video Here
          </div>

          <button className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600">
            Upload Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default Upload