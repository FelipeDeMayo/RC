import { createContext } from 'react';
import type { User } from '../services/authService'; 

export interface AuthContextData { 
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, receivedToken: string) => void;
  logoutUser: () => void;
  isAuthenticated: boolean; // <-- ADICIONADO!
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);