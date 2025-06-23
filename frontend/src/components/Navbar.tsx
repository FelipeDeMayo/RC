import React from 'react'
import {
  NavButton,
  Logo,
  NavLinks,
  TopBar
} from '../styles/NavBarStyles'

interface NavbarProps {
  onCartToggle: () => void
  isCartOpen: boolean
  userName?: string
  onLogout?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onCartToggle, isCartOpen, userName, onLogout }) => {
  return (
    <TopBar>
      <Logo>Minha Loja</Logo>

      <NavLinks>
        {userName && <span>Olá, {userName}</span>}

        {userName && onLogout && (
          <NavButton onClick={onLogout} color="#f44336">
            Logout
          </NavButton>
        )}

        <NavButton onClick={onCartToggle} className="cart">
          {isCartOpen ? 'Fechar Carrinho' : 'Abrir Carrinho'}
        </NavButton>
      </NavLinks>
    </TopBar>
  )
}

export default Navbar
