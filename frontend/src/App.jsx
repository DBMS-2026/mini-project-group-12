import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            fontSize: '14px',
            fontWeight: 500,
            padding: '12px 20px',
            boxShadow: 'var(--shadow-lg)',
            backdropFilter: 'blur(20px)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
          error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
        }}
      />
      <AppRoutes />
    </CartProvider>
  )
}

export default App