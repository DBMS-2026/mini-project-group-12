function Reels() {
  const reels = [
    {
      id: 1,
      username: 'burger_lover',
      caption: 'Amazing burger reel 🍔',
      restaurant: 'Burger King',
    },
    {
      id: 2,
      username: 'pizza_guy',
      caption: 'Cheese pull pizza 🍕',
      restaurant: 'Dominos',
    },
  ]

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {reels.map((reel) => (
        <div key={reel.id} className="snap-start">
          <ReelCard reel={reel} />
        </div>
      ))}
    </div>
  )
}

export default Reels