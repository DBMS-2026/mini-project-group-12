function RestaurantPosts() {
  const posts = [
    {
      id: 1,
      title: 'Cheese Burger',
      subtitle: 'Popular dish',
      image: '/images/burger.jpg',
    },
    {
      id: 2,
      title: 'Chicken Burger',
      subtitle: 'Customer favourite',
      image: '/images/chickenburger.jpg',
    },
    {
      id: 3,
      title: 'French Fries',
      subtitle: 'Best side dish',
      image: '/images/fries.jpg',
    },
    {
      id: 4,
      title: 'Cold Coffee',
      subtitle: 'Refreshing drink',
      image: '/images/coffee.jpg',
    },
  ]

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Food Posts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-[30px] overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-5">
              <h3 className="text-2xl font-bold text-gray-800">
                {post.title}
              </h3>
              <p className="text-gray-500 mt-2">
                {post.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RestaurantPosts