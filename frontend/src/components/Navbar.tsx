import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaUserCog } from 'react-icons/fa';

import { useAuth } from '../contexts/useAuth';
import { useCart } from '../hooks/useCart';
import type { ProductWithQuantity } from '../contexts/CartContextType';

import {
  TopBar,
  NavLinks,
  NavButton,
  LogoLink,
  HamburgerButton,
  CartButtonWrapper, 
  CartBadge,
  UserActions,
  AuthActions
} from '../styles/HeaderStyles';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
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
          // AGORA TODOS OS ITENS DO USUÁRIO ESTÃO DENTRO DE UserActions
          <UserActions>
            <span className="user-greeting">Olá, {user?.name}</span>
            <NavButton $variant="secondary" onClick={() => { logoutUser(); navigate('/login'); }}>
              Sair
            </NavButton>
            
            {user?.role === 'ADMIN' ? (
              <NavButton as={Link} to="/crud/products" title="Painel do Admin">
                <FaUserCog size={22} />
              </NavButton>
            ) : (
              <CartButtonWrapper as={Link} to="/cart" title="Ver Carrinho">
                <FaShoppingCart size={22} />
                {totalItemsInCart > 0 && <CartBadge>{totalItemsInCart}</CartBadge>}
              </CartButtonWrapper>
            )}
          </UserActions>
        ) : (
          <AuthActions>
            <NavButton $variant="secondary" onClick={() => navigate('/login')}>
              Entrar
            </NavButton>
            <NavButton $variant="primary" onClick={() => navigate('/register')}>
              Cadastrar
            </NavButton>
          </AuthActions>
        )}

      </NavLinks>

      <HamburgerButton onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </HamburgerButton>
    </TopBar>
  );
};

export default Navbar;