import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../contexts/CartContextType'
import { useAuth } from '../contexts/useAuth'

const Header = () => {
  const { user, logoutUser } = useAuth()
  const cart = useContext(CartContext)

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      <Link to="/">🏠 Home</Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/cart">
          🛒 Carrinho ({cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0)})
        </Link>

        {user && <span>{user.name}</span>}

        {user ? (
          <button onClick={logoutUser}>Sair</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Criar Conta</Link>
          </>
        )}
      </div>
    </header>
  )
}
export default Header
