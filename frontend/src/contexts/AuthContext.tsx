import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logoutUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Erro ao fazer parse do usuário salvo:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
