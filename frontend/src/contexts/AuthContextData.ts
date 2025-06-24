import { createContext } from 'react'
import type { User } from '../types/User'

export interface AuthContextType {
  user: User | null
  token: string | null
  setUser: (user: User | null, token?: string | null) => void
  logoutUser: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
