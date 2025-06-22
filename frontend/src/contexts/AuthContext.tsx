import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: string
  token: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logoutUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsed = JSON.parse(storedUser)
        console.log('🔍 Usuário carregado do localStorage:', parsed)
        setUser(parsed)
      } catch (error) {
        console.error('Erro ao fazer parse do usuário salvo:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const logoutUser = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) return <p>Carregando...</p>

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
