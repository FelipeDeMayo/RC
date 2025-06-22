import { useAuth } from '../contexts/useAuth'
import { useNavigate } from 'react-router-dom'
import { TopBar, Button } from '../styles/HomePageStyles'

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
            <Button onClick={() => navigate('/profile')}>Perfil</Button>
          </>
        ) : (
          <>
            <Button className="login" onClick={() => navigate('/login')}>Login</Button>
            <Button className="register" onClick={() => navigate('/register')}>Criar Conta</Button>
          </>
        )}
        <Button onClick={onCartToggle}>
          {isCartOpen ? 'Fechar Carrinho' : '🛒 Carrinho'}
        </Button>
      </div>
    </TopBar>
  )
}

export default Navbar
