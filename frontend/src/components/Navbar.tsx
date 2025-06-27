import React, { useState } from 'react';
import {
  NavButton,
  TopBar,
  LogoLink, 
  NavLinks,
  HamburgerButton 
} from '../styles/HeaderStyles';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

interface NavbarProps {
  onCartToggle: () => void;
  isCartOpen: boolean;
  userName?: string;
  onLogout?: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onCartToggle,
  isCartOpen,
  userName,
  onLogout,
  onLogin,
  onRegister
}) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <TopBar>
      <LogoLink to="/">RC Fitness</LogoLink>
      <NavLinks className={isMobileMenuOpen ? 'active' : ''}>
        {userName ? (
          <>
            <span className="user-greeting">Olá, {userName}</span>

            {onLogout && (
              <NavButton variant="primary" onClick={onLogout}>
                Sair
              </NavButton>
            )}
          </>
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
        <NavButton variant="ghost" onClick={onCartToggle}>
            <FaShoppingCart size={22} />
            <span style={{ marginLeft: '8px' }}>
              {isCartOpen ? 'Fechar' : 'Carrinho'}
            </span>
          </NavButton>
      </NavLinks>
      <HamburgerButton onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </HamburgerButton>
    </TopBar>
  );
};

export default Navbar;