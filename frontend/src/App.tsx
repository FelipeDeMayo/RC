// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext'; 
import { useAuth } from './contexts/useAuth';
import { CartProvider } from './contexts/CartProvider';
import { useCart } from './contexts/useCart';
import CartModal from './components/CartModal';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import AdminRoute from './routes/AdminRoute';
import AdminProductsPage from './pages/AdminProductsPage';

function AppContent() {
  const navigate = useNavigate();
  const { user, logoutUser, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  const handleLoginNavigation = () => {
    console.log("Navegando para a página de login...");
    navigate('/login');
  };

  const handleRegisterNavigation = () => {
    console.log("Navegando para a página de registro...");
    navigate('/register'); 
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
        onLogin={!isAuthenticated ? handleLoginNavigation : undefined}
        onRegister={!isAuthenticated ? handleRegisterNavigation : undefined}
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
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}


function App() {
  return (
    <Router> 
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
