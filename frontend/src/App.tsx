import { useState } from 'react'
import { AppRoutes } from './routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/useAuth'
import { CartProvider } from './contexts/CartProvider'
import CartModal from './components/CartModal'
import { useCart } from './contexts/useCart'

function AppContent() {
  const { user, logoutUser } = useAuth()
  const { cartItems } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const toggleCart = () => {
    setIsCartOpen(prev => !prev)
  }

  return (
    <>
      <Header
        onCartToggle={toggleCart}
        isCartOpen={isCartOpen}
        userName={user?.name}
        onLogout={logoutUser}
      />

      {isCartOpen && <CartModal items={cartItems} onClose={toggleCart} />}

      <AppRoutes />
      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
