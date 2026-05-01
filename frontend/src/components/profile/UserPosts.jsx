function UserPosts() {
  const posts = [
    {
      id: 1,
      title: 'Burger Post',
      image: '/images/burger.jpg',
    },
    {
      id: 2,
      title: 'Pizza Post',
      image: '/images/pizza.jpg',
    },
    {
      id: 3,
      title: 'Waffle Post',
      image: '/images/waffle.jpg',
    },
    {
      id: 4,
      title: 'Biryani Post',
      image: '/images/biryani.jpg',
    },
    {
      id: 5,
      title: 'Ice Cream Post',
      image: '/images/icecream.jpg',
    },
    {
      id: 6,
      title: 'Coffee Post',
      image: '/images/coffee.jpg',
    },
  ]

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Posts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserPosts