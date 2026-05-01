import { Video } from 'lucide-react'

function VideoUpload() {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Upload Reel Video
      </label>

      <div className="border-2 border-dashed border-gray-300 rounded-3xl h-52 flex flex-col items-center justify-center text-gray-500 hover:border-orange-400 transition-all duration-300 cursor-pointer">
        <Video size={40} />
        <p className="mt-3">Click or drag video here</p>
      </div>
    </div>
  )
}

export default VideoUpload