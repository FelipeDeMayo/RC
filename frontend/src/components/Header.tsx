import { Link } from 'react-router-dom'
import { useCart } from '../contexts/useCart'

const Header = () => {
  const { cartItems } = useCart()
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ fontWeight: 'bold' }}>🏠 Home</Link>

      <Link to="/cart">
        🛒 Carrinho ({totalItems})
      </Link>
    </header>
  )
}

export default Header
