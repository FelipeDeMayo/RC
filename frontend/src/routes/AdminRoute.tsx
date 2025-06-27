import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth()

  // 🔍 Debug opcional — loga o usuário atual
  console.log('👤 Verificando acesso admin para:', user)

  // ❌ Se não estiver logado ou não for admin, redireciona
  if (!user || user.role !== 'ADMIN') {
    console.warn('🔒 Acesso negado. Redirecionando...')
    return <Navigate to="/" replace />
  }

  // ✅ Acesso permitido
  return <>{children}</>
}

export default AdminRoute
