import { createContext } from 'react';
import type { User } from '../services/authService';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (data: { email: string, password: string }) => Promise<{ success: boolean, twoFactorRequired?: boolean }>;
  loginWith2FA: (token: string) => Promise<{ success: boolean }>;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);