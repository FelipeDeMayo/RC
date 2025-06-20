import { Link } from 'react-router-dom'
import { Container, Title, Description, ButtonGroup, Button } from '../styles/HomePageStyles'
import { useAuth } from '../contexts/useAuth'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <Container>
      {user ? (
        <>
          <Title>🛍️ Bem-vindo, {user.name}!</Title>
          <Description>Email: {user.email}</Description>
          {user.role && <Description>Perfil: {user.role}</Description>}
        </>
      ) : (
        <>
          <Title>🛍️ Bem-vindo ao E-commerce</Title>
          <Description>Em breve, uma lista de produtos incríveis estará aqui.</Description>

          <ButtonGroup>
            <Link to="/login">
              <Button className="login">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="register">Criar Conta</Button>
            </Link>
          </ButtonGroup>
        </>
      )}
    </Container>
  )
}

export default HomePage
