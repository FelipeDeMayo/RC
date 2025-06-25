// src/contexts/useAuth.ts (ou src/hooks/useAuth.ts)
import { useContext } from 'react';
import { AuthContext, type AuthContextData } from './AuthContextData'; // <-- Importe os tipos corretos

export const useAuth = (): AuthContextData => { // <-- Tipagem correta para o retorno
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};