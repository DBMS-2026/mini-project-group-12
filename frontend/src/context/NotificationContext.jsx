import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = 'success') => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 4000)
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`px-6 py-4 rounded-2xl shadow-xl text-white text-lg font-semibold animate-slide-in ${
              notif.type === 'success'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : notif.type === 'error'
                ? 'bg-gradient-to-r from-red-500 to-rose-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`}
            onClick={() => removeNotification(notif.id)}
          >
            {notif.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}
