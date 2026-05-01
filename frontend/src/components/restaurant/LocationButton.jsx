import { MapPin } from 'lucide-react'

function LocationButton() {
  return (
    <button className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 mt-8">
      <MapPin size={20} />
      Open in Google Maps
    </button>
  )
}

export default LocationButton