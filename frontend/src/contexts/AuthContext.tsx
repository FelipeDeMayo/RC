// src/contexts/AuthContext.tsx
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/User'
import { AuthContext } from './AuthContextData'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser: User = JSON.parse(storedUser)
        setUserState(parsedUser)
        if (parsedUser.token) setToken(parsedUser.token)
      } catch (error) {
        console.error('Erro ao parse do usuário salvo:', error)
        localStorage.removeItem('user')
      }
    }

    if (storedToken) setToken(storedToken)
    setLoading(false)
  }, [])

  const setUser = (user: User | null, tokenValue?: string | null) => {
    setUserState(user)
    if (user && tokenValue) {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', tokenValue)
      setToken(tokenValue)
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      setToken(null)
    }
  }

  const logoutUser = () => {
    setUser(null)
  }

  if (loading) return <p>Carregando...</p>

  return (
    <AuthContext.Provider value={{ user, token, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}
