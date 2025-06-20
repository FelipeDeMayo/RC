import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <h1>Bem-vindo ao E-commerce</h1>
      <p>Em breve, uma lista de produtos aqui.</p>

      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  )
}

export default HomePage
