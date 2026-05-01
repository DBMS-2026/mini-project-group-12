function RestaurantCard({ restaurant }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[35px] shadow-2xl border border-white/30 overflow-hidden">
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="w-full h-72 object-cover"
      />

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {restaurant.name}
            </h1>

            <p className="text-gray-500 mt-2">
              {restaurant.location}
            </p>
          </div>

          <div className="bg-red-500 text-white px-5 py-3 rounded-2xl text-lg font-semibold">
            ⭐ {restaurant.rating}
          </div>
        </div>

        <p className="mt-5 text-gray-600 text-lg">
          {restaurant.description}
        </p>
      </div>
    </div>
  )
}

export default RestaurantCard