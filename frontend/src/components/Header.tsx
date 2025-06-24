import { Link } from 'react-router-dom'
import {
  TopBar,
  NavLinks,
  NavButton,
  Logo,
  LogoLink
} from '../styles/HeaderStyles'

interface HeaderProps {
  onCartToggle: () => void
  isCartOpen: boolean
  userName?: string
  onLogout?: () => void
}

const Header: React.FC<HeaderProps> = ({
  onCartToggle,
  isCartOpen,
  userName,
  onLogout
}) => {
  return (
    <TopBar>
      <Logo>
        <LogoLink to="/">🏠 Home</LogoLink>
      </Logo>

      <NavLinks>
        <NavButton className="cart" onClick={onCartToggle}>
          {isCartOpen ? '🛒 Fechar Carrinho' : '🛒 Abrir Carrinho'}
        </NavButton>

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
            <NavButton as={Link} to="/login" className="login">
              Entrar
            </NavButton>
            <NavButton as={Link} to="/register" className="register">
              Cadastrar
            </NavButton>
          </>
        )}
      </NavLinks>
    </TopBar>
  )
}

export default Header
