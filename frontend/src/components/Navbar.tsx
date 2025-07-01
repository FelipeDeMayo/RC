import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaUserCog } from 'react-icons/fa'; // Importa um novo ícone para o Admin

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

// A interface agora fica mais simples, não precisamos mais do onCartToggle
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
            <NavButton $variant="primary" onClick={() => navigate('/register')}>
              Cadastrar
            </NavButton>
          </>
        )}
        
       
        {isAuthenticated && ( // Só mostra um ícone de ação se o usuário estiver logado
          <>
            {user?.role === 'ADMIN' ? (
              // Se for ADMIN, o link leva para o painel de produtos
              <NavButton as={Link} to="/crud/products" title="Painel do Admin">
                <FaUserCog size={22} />
              </NavButton>
            ) : (
              // Se for CLIENT, o link leva para a página do carrinho
              <CartButtonWrapper as={Link} to="/cart" title="Ver Carrinho">
                <FaShoppingCart size={22} />
                {totalItemsInCart > 0 && <CartBadge>{totalItemsInCart}</CartBadge>}
              </CartButtonWrapper>
            )}
          </>
        )}

      </NavLinks>

      <HamburgerButton onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </HamburgerButton>
    </TopBar>
  );
};

export default Navbar;