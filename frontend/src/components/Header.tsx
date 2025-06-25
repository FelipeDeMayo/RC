import React, { useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContextType';  
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import {
  TopBar,
  NavLinks,
  NavButton,
  LogoLink,
  HamburgerButton,
  CartButtonWrapper, 
  CartBadge 
} from '../styles/HeaderStyles';

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
  onCartToggle: () => void;
  isCartOpen: boolean;      
}

const Header: React.FC<HeaderProps> = ({
  userName,
  onLogout,
  onLogin,
  onRegister,
}) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartContext = useContext(CartContext);
  const totalItems = cartContext?.cartItems.reduce(
      (acc, item) => acc + item.quantity, 
      0
  ) || 0;

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <>
      <TopBar>
        <LogoLink to="/">RC Fitness</LogoLink>

        <NavLinks className={isMobileMenuOpen ? 'active' : ''}>
          
          {userName && <span className="user-greeting">Olá, {userName}</span>}
          
          <CartButtonWrapper onClick={toggleCart}>
            <FaShoppingCart size={22} />
            {totalItems > 0 && <CartBadge>{totalItems}</CartBadge>}
          </CartButtonWrapper>

          {userName ? (
            onLogout && (
              <NavButton variant="primary" onClick={onLogout}>
                Sair
              </NavButton>
            )
          ) : (
            <>
              {onLogin && (
                <NavButton variant="secondary" onClick={onLogin}>
                  Entrar
                </NavButton>
              )}
              {onRegister && (
                <NavButton variant="primary" onClick={onRegister}>
                  Cadastrar
                </NavButton>
              )}
            </>
          )}
        </NavLinks>

        <HamburgerButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </HamburgerButton>
      </TopBar>
      {isCartOpen && (
        <div style={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            background: 'white', 
            padding: '2rem', 
            border: '1px solid #ccc',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            zIndex: 2000 
        }}>
            <h2>Seu Carrinho</h2>
            <p>Total de itens: {totalItems}</p>
            <button onClick={toggleCart} style={{marginTop: '1rem'}}>Fechar</button>
        </div>
      )}
    </>
  );
};

export default Header;