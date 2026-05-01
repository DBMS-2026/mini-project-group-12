function ProfileTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'posts', label: 'Posts 📷' },
    { id: 'saved', label: 'Saved 🔖' },
  ]

  return (
    <div className="flex gap-2 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-orange-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default ProfileTabs
