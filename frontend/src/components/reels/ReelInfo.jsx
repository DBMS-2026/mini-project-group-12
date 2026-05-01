function ReelInfo({ reel }) {
  return (
    <div className="absolute bottom-8 left-6 text-white max-w-[70%]">
      <h2 className="text-2xl font-bold mb-2">
        @{reel.username}
      </h2>

      <p className="text-base mb-2">
        {reel.caption}
      </p>

      <p className="text-sm text-gray-300">
        {reel.restaurant}
      </p>
    </div>
  )
}

export default ReelInfo