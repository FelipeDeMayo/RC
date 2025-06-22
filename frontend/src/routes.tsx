import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductPage from './pages/ProductPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import AdminRoute from './routes/AdminRoute'
import AdminProductsPage from './pages/AdminProductsPage'
import CartPage from './pages/CartPage'
import Header from './components/Header'

export const AppRoutes = () => (
  <>
    <Header /> {/* ✅ Coloque fora do <Routes> */}
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/crud/products"
        element={
          <AdminRoute>
            <AdminProductsPage />
          </AdminRoute>
        }
      />
    </Routes>
  </>
)

export default AppRoutes
