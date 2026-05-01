import ReelCard from '../components/reels/ReelCard'

function Reels() {
  const reels = [
    {
      id: 1,
      username: 'burger_lover',
      caption: 'Amazing burger reel 🍔',
      restaurant: 'Burger King',
      video: '/videos/burger-reel.mp4',
    },
    {
      id: 2,
      username: 'pizza_guy',
      caption: 'Cheese pull pizza 🍕',
      restaurant: 'Dominos',
      video: '/videos/pizza-reel.mp4',
    },
    {
      id: 3,
      username: 'sweet_tooth',
      caption: 'Chicken overload 🍗',
      restaurant: 'Biryani House',
      video: '/videos/biryani-reel.mp4',
    },
  ]

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {reels.map((reel) => (
        <div key={reel.id} className="snap-start">
          <ReelCard reel={reel} />
        </div>
      ))}
    </div>
  )
}

export default Reels