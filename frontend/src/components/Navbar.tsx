import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

import { useAuth } from '../contexts/useAuth';
import { useCart } from '../contexts/useCart';
import type { ProductWithQuantity } from '../contexts/CartContextType';

import {
  TopBar,
  NavLinks,
  NavButton,
  LogoLink,
  HamburgerButton,
  CartButtonWrapper, 
  CartBadge 
} from '../styles/HeaderStyles';

interface NavbarProps {
  onCartToggle: () => void;
  isCartOpen: boolean;
  userName?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartToggle }) => {
  const { cartItems } = useCart();
  const { user, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItemsInCart = cartItems.reduce(
    (acc: number, item: ProductWithQuantity) => acc + item.quantity, 
    0
  );

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  return (
    <TopBar>
      <LogoLink to="/">RC Fitness</LogoLink>

      <NavLinks className={isMobileMenuOpen ? 'active' : ''}>
        
        {isAuthenticated ? (
          <>
            <span className="user-greeting">Olá, {user?.name}</span>
            <NavButton $variant="primary" onClick={() => { logoutUser(); navigate('/login'); }}>
              Sair
            </NavButton>
          </>
        ) : (
          <>
            <NavButton $variant="secondary" onClick={() => navigate('/login')}>
              Entrar
            </NavButton>
            <NavButton $variant="secondary" onClick={() => navigate('/register')}>
              Cadastrar
            </NavButton>
          </>
        )}
        <CartButtonWrapper onClick={onCartToggle}>
          <FaShoppingCart size={22} />
          {totalItemsInCart > 0 && <CartBadge>{totalItemsInCart}</CartBadge>}
        </CartButtonWrapper>

      </NavLinks>

      <HamburgerButton onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </HamburgerButton>
    </TopBar>
  );
};

export default Navbar;