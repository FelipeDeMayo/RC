import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Container,
  Title,
  Description,
  ButtonGroup,
  Button,
  TopBar
} from '../styles/HomePageStyles'
import { useAuth } from '../contexts/useAuth'

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
      {/* Topo com informações do usuário e botões */}
      <TopBar>
        <div>
          <Title>
            {user ? `🛍️ Bem-vindo, ${user.name}!` : '🛍️ Bem-vindo ao E-commerce'}
          </Title>
          {user ? (
            <>
              <Description>Email: {user.email}</Description>
              {user.role && <Description>Perfil: {user.role}</Description>}
            </>
          ) : (
            <Description>Em breve, uma lista de produtos incríveis estará aqui.</Description>
          )}
        </div>

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
      </TopBar>

      {/* Lista de produtos */}
      <div style={{ marginTop: '2rem', width: '100%' }}>
        <h2 style={{ marginBottom: '1rem' }}>Produtos disponíveis:</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  width: '250px',
                  backgroundColor: '#fff',
                  textAlign: 'center'
                }}
              >
                {product.image && (
                  <img
                    src={
                      product.image.startsWith('http')
                        ? product.image
                        : `http://localhost:3000/uploads/${product.image}`
                    }
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}
                  />
                )}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>R$ {product.price.toFixed(2)}</strong>
              </div>
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
