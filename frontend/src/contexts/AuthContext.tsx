import { useState, useEffect, type ReactNode } from 'react'; 
import type { User } from '../services/authService'; 
import { AuthContext, type AuthContextData } from '../contexts/AuthContextData'; 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Falha ao carregar dados do usuário:', error);
        localStorage.clear();
        setIsAuthenticated(false); 
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User, receivedToken: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', receivedToken);
    setUser(userData);
    setToken(receivedToken);
    setIsAuthenticated(true); 
  };

  const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false); 
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando aplicação...</p>;
  }

  const contextValue: AuthContextData = {
    user,
    token,
    loading,
    login,
    logoutUser,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
