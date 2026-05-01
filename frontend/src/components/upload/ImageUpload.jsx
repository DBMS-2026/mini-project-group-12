import { ImagePlus } from 'lucide-react'

function ImageUpload() {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Upload Food Image
      </label>

      <div className="border-2 border-dashed border-gray-300 rounded-3xl h-52 flex flex-col items-center justify-center text-gray-500 hover:border-red-400 transition-all duration-300 cursor-pointer">
        <ImagePlus size={40} />
        <p className="mt-3">Click or drag image here</p>
      </div>
    </div>
  )
}

export default ImageUpload