function ReelCard({ reel }) {
  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      <div className="w-[350px] h-[600px] bg-gray-800 rounded-3xl flex items-center justify-center text-white">
        Reel Video Here
      </div>

      <div className="absolute bottom-10 left-10 text-white">
        <h2 className="text-xl font-bold">{reel.username}</h2>
        <p>{reel.caption}</p>
        <p className="text-sm text-gray-300">{reel.restaurant}</p>
      </div>

      <div className="absolute right-10 bottom-20 flex flex-col gap-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded-full">
          Like
        </button>
        <button className="bg-white text-black px-4 py-2 rounded-full">
          Comment
        </button>
      </div>
    </div>
  )
}

export default ReelCard