function UploadPreview({ imagePreview, videoPreview, onClearImage, onClearVideo }) {
  return (
    <div className="space-y-4">
      {imagePreview && (
        <div className="relative">
          <img src={imagePreview} alt="Preview" className="w-full h-80 object-cover rounded-3xl" />
          {onClearImage && (
            <button onClick={onClearImage} className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70">✕</button>
          )}
        </div>
      )}
      {videoPreview && (
        <div className="relative">
          <video src={videoPreview} controls className="w-full h-96 object-cover rounded-3xl" />
          {onClearVideo && (
            <button onClick={onClearVideo} className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70">✕</button>
          )}
        </div>
      )}
    </div>
  )
}

export default UploadPreview
