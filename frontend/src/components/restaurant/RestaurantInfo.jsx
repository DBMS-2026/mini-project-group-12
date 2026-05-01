import { Clock, MapPin, Phone, Globe } from 'lucide-react'

function RestaurantInfo() {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[35px] shadow-xl border border-white/30 p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Restaurant Info
      </h2>

      <div className="space-y-5">
        <div className="flex items-center gap-4 text-gray-700">
          <Clock className="text-red-500" />
          <span>10:00 AM - 11:00 PM</span>
        </div>

        <div className="flex items-center gap-4 text-gray-700">
          <MapPin className="text-orange-500" />
          <span>Hyderabad, India</span>
        </div>

        <div className="flex items-center gap-4 text-gray-700">
          <Phone className="text-red-500" />
          <span>+91 9876543210</span>
        </div>

        <div className="flex items-center gap-4 text-gray-700">
          <Globe className="text-orange-500" />
          <span>www.restaurant.com</span>
        </div>
      </div>
    </div>
  )
}

export default RestaurantInfo