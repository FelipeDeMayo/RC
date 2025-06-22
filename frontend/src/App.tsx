import { AppRoutes } from './routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartProvider'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <AppRoutes />
        <ToastContainer />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
