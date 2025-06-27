import { useAuth } from '../contexts/useAuth'

const ProfilePage = () => {
  const { user } = useAuth()

  if (!user) {
    return <p>Você precisa estar logado para ver essa página.</p>
  }

  return (
    <div>
      <h1>Olá, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {user.role && <p>Função: {user.role}</p>}
    </div>
  )
}

export default ProfilePage
