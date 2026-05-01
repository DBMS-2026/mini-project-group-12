function ReelSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-md animate-pulse">
          <div className="h-[500px] bg-gray-200"></div>
          <div className="p-5">
            <div className="h-5 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-48 bg-gray-200 rounded-lg mt-3"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReelSkeleton
