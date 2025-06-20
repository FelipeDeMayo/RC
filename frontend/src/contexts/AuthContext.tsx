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

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }


