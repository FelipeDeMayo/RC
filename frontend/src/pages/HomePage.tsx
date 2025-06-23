import { useEffect, useState } from 'react'
import {
  Container,
  Title
} from '../styles/HomePageStyles'
import { useAuth } from '../contexts/useAuth'
import ProductCard from '../components/ProductCard'
import CartModal from '../components/CartModal'
import Navbar from '../components/Navbar'

import { useCart } from '../contexts/useCart'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string
}

const HomePage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const { cartItems } = useCart()

  useEffect(() => {
    fetch('http://localhost:3000/api/products', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.warn('Resposta inesperada:', data)
        }
      })
      .catch(err => console.error('Erro ao buscar produtos:', err))
  }, [])

  const toggleCart = () => {
    setIsCartOpen(prev => !prev)
  }

  return (
    <>
      <Navbar onCartToggle={toggleCart} isCartOpen={isCartOpen} />
      {isCartOpen && <CartModal items={cartItems} onClose={toggleCart} />}

      <Container style={{ paddingTop: '100px' }}>
        <Title>
          {user ? `🛍️ Bem-vindo, ${user.name}!` : '🛍️ Produtos disponíveis:'}
        </Title>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '2rem',
          }}
        >
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
              />
            ))
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
      </Container>
    </>
  )
}

export default HomePage
