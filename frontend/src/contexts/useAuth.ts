// src/contexts/useAuth.ts
import { useContext } from 'react'
import { AuthContext } from './AuthContextData'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
