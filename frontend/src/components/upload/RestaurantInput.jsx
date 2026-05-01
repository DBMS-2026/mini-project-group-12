function RestaurantInput() {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Restaurant Name
      </label>

      <input
        type="text"
        placeholder="Enter restaurant name..."
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  )
}

export default RestaurantInput