import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/useAuth'
import ProductCard from '../components/ProductCard'
import CartModal from '../components/CartModal'
import { useCart } from '../contexts/useCart'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string
}

const Container = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  box-sizing: border-box;
`

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

const HomePage: React.FC = () => {
  const { user, token } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems } = useCart()

  useEffect(() => {
    const headers: HeadersInit = {}

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    fetch('http://localhost:3000/api/products', { headers })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Erro HTTP ${res.status}: ${text}`)
        }
        return res.json()
      })
      .then(data => {
        setProducts(Array.isArray(data) ? data : [])
      })
      .catch(err => console.error('Erro ao buscar produtos:', err))
  }, [token])

  const toggleCart = () => {
    setIsCartOpen(prev => !prev)
  }

  return (
    <>
      {isCartOpen && <CartModal items={cartItems} onClose={toggleCart} />}

      <Container style={{ paddingTop: '100px' }}>
        <Title>
          {user ? `Bem-vindo, ${user.name}!` : 'Produtos disponíveis:'}
        </Title>

        <ProductsGrid>
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
        </ProductsGrid>
      </Container>
    </>
  )
}

export default HomePage
