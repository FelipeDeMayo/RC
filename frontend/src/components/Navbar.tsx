import { useAuth } from '../contexts/useAuth'
import { useNavigate } from 'react-router-dom'
import { TopBar, Button } from '../styles/HomePageStyles'
import { NavButton } from '../styles/NavBarStyles'

interface NavbarProps {
  onCartToggle: () => void
  isCartOpen: boolean
}

const Navbar = ({ onCartToggle, isCartOpen }: NavbarProps) => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  return (
    <TopBar>
      <div>🏠 Home</div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {user ? (
          <>
            <Button className="logout" onClick={logoutUser}>Logout</Button>
            <NavButton color="#28a745" onClick={() => navigate('/profile')}>Perfil</NavButton>
            <NavButton color="#ff6600" onClick={onCartToggle}>
              {isCartOpen ? 'Fechar Carrinho' : '🛒 Carrinho'}
            </NavButton>
          </>
        ) : (
          <>
            <Button className="login" onClick={() => navigate('/login')}>Login</Button>
            <Button className="register" onClick={() => navigate('/register')}>Criar Conta</Button>
          </>
        )}
      </div>
    </TopBar>
  )
}

export default Navbar
