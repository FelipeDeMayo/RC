import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Container,
  Title,
  ButtonGroup,
  Button,
  TopBar
} from '../styles/HomePageStyles'
import { useAuth } from '../contexts/useAuth'
import { ProductCard } from '../components/ProductCard'
import { ProfileContainer, ProfileIcon } from '../styles/HomePageStyles'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string
}

const HomePage = () => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/products', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.warn('Resposta inesperada:', data)
        }
      })
      .catch((err) => console.error('Erro ao buscar produtos:', err))
  }, [])

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  return (
    <Container>
      <TopBar>
  <div>
    <Title>
      {user ? `🛍️ Bem-vindo, ${user.name}!` : '🛍️ Bem-vindo ao E-commerce'}
    </Title>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
    {user && user.role && (
      <ProfileContainer>
        <ProfileIcon />
        {user.role}
      </ProfileContainer>
    )}

    <ButtonGroup>
      {user ? (
        <Button className="logout" onClick={handleLogout}>
          Sair
        </Button>
      ) : (
        <>
          <Link to="/login">
            <Button className="login">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="register">Criar Conta</Button>
          </Link>
        </>
      )}
    </ButtonGroup>
  </div>
</TopBar>

      <div style={{ marginTop: '2rem', width: '100%' }}>
        <h2 style={{ marginBottom: '1rem' }}>Produtos disponíveis:</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
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
      </div>
    </Container>
  )
}

export default HomePage
