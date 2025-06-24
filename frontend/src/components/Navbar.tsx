import React from 'react'
import {
  NavButton,
  TopBar,
  Logo,
  NavLinks
} from '../styles/HeaderStyles'

interface NavbarProps {
  onCartToggle: () => void
  isCartOpen: boolean
  userName?: string
  onLogout?: () => void
  onLogin?: () => void
  onRegister?: () => void
}

const Navbar: React.FC<NavbarProps> = ({
  onCartToggle,
  isCartOpen,
  userName,
  onLogout,
  onLogin,
  onRegister
}) => {
  return (
    <TopBar>
      <Logo>RC Fitness</Logo>

      <NavLinks>
        {userName ? (
          <>
            <span>Olá, {userName}</span>

            {onLogout && (
              <NavButton className="logout" onClick={onLogout}>
                Sair
              </NavButton>
            )}
          </>
        ) : (
          <>
            {onLogin && (
              <NavButton className="login" onClick={onLogin}>
                Entrar
              </NavButton>
            )}
            {onRegister && (
              <NavButton className="register" onClick={onRegister}>
                Cadastrar
              </NavButton>
            )}
          </>
        )}

        <NavButton className="cart" onClick={onCartToggle}>
          {isCartOpen ? 'Fechar Carrinho' : 'Abrir Carrinho'}
        </NavButton>
      </NavLinks>
    </TopBar>
  )
}

export default Navbar
