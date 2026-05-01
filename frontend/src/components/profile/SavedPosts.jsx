function SavedPosts() {
  const savedPosts = [
    {
      id: 1,
      title: 'Burger Post',
      subtitle: 'Saved recently',
      image: '/images/burger.jpg',
    },
    {
      id: 2,
      title: 'Pizza Post',
      subtitle: 'Saved recently',
      image: '/images/pizza.jpg',
    },
    {
      id: 3,
      title: 'Biryani Post',
      subtitle: 'Saved recently',
      image: '/images/biryani.jpg',
    },
    {
      id: 4,
      title: 'Pasta Post',
      subtitle: 'Saved recently',
      image: '/images/pasta.jpg',
    },
    {
      id: 5,
      title: 'Waffle Post',
      subtitle: 'Saved recently',
      image: '/images/waffle.jpg',
    },
    {
      id: 6,
      title: 'Coffee Post',
      subtitle: 'Saved recently',
      image: '/images/coffee.jpg',
    },
  ]

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Saved Posts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {savedPosts.map((post) => (
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
              <p className="text-gray-500 mt-2">{post.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedPosts