import CaptionInput from './CaptionInput'
import RestaurantInput from './RestaurantInput'
import ImageUpload from './ImageUpload'
import VideoUpload from './VideoUpload'

function UploadForm() {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[35px] shadow-2xl border border-white/30 p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Upload Food Post 🍔
      </h1>

      <div className="space-y-6">
        <CaptionInput />

        <RestaurantInput />

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Google Maps Link
          </label>

          <input
            type="text"
            placeholder="Paste restaurant location link..."
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <ImageUpload />

        <VideoUpload />

        <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl text-lg font-semibold hover:scale-[1.02] transition-all duration-300">
          Upload Post
        </button>
      </div>
    </div>
  )
}

export default UploadForm