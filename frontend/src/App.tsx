import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import CartModal from './components/CartModal';
import AdminRoute from './routes/AdminRoute';

import { useAuth } from './contexts/useAuth';
import { useCart } from './contexts/useCart';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import AdminProductsPage from './pages/AdminProductsPage';

function App() {
  const navigate = useNavigate();
  const { user, logoutUser, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const handleLogoutAction = () => {
    logoutUser();
    navigate('/login');
    toast.info('Você foi desconectado.');
  };

  return (
    <>
      <Navbar
        onCartToggle={toggleCart}
        isCartOpen={isCartOpen}
        userName={user?.name}
        onLogout={isAuthenticated ? handleLogoutAction : undefined}
      />

      {isCartOpen && <CartModal items={cartItems} onClose={toggleCart} />}
      
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
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;