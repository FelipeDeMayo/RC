// src/components/Header.tsx
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../contexts/CartContextType'
import { useAuth } from '../contexts/useAuth'

import {
  TopBar,
  NavLinks,
  NavButton,
  Logo
} from '../styles/NavBarStyles'

const Header = () => {
  const { user, logoutUser } = useAuth()
  const cart = useContext(CartContext)

  const totalItems = cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <TopBar>
      <Logo>
        <Link to="/">🏠 Home</Link>
      </Logo>

      <NavLinks>
        <NavButton className="cart" as={Link} to="/cart">
          🛒 Carrinho ({totalItems})
        </NavButton>

        {user && <span>{user.name}</span>}

        {user ? (
          <NavButton onClick={logoutUser} color="#f44336">
            Sair
          </NavButton>
        ) : (
          <>
            <NavButton as={Link} to="/login">
              Login
            </NavButton>
            <NavButton as={Link} to="/register">
              Criar Conta
            </NavButton>
          </>
        )}
      </NavLinks>
    </TopBar>
  )
}

export default Header
