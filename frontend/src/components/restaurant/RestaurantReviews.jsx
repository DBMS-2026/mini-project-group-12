import { Star } from 'lucide-react'

function RestaurantReviews({ reviews = [] }) {
  const dummyReviews = reviews.length ? reviews : [
    { id: 1, user: 'shankar_foodie', rating: 5, text: 'Amazing food and great ambiance! Must visit.', date: '2 days ago' },
    { id: 2, user: 'pizza_lover', rating: 4, text: 'Good food but slightly expensive. Worth trying once.', date: '1 week ago' },
    { id: 3, user: 'street_foodie', rating: 5, text: 'Best place in the city for this cuisine!', date: '2 weeks ago' },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Reviews ⭐</h2>
      <div className="space-y-4">
        {dummyReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-[28px] shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">@{review.user}</h3>
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#f97316" className="text-orange-500" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-lg">{review.text}</p>
            <p className="text-gray-400 mt-2">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RestaurantReviews
