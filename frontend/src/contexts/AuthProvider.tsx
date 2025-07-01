import { useState, useEffect, type ReactNode } from 'react';
import { login as loginService, loginWithTwoFactor, type User } from '../services/authService';
import api from '../services/api';
import { AuthContext, type AuthContextType } from './AuthContextType';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userIdFor2FA, setUserIdFor2FA] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      } catch (error) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (data: { email: string; password: string; }) => {
    try {
      const response = await loginService(data);
      if ('twoFactorRequired' in response && response.twoFactorRequired) {
        setUserIdFor2FA(response.userId);
        return { success: true, twoFactorRequired: true };
      }
      if ('accessToken' in response) {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setToken(response.accessToken);
        api.defaults.headers.Authorization = `Bearer ${response.accessToken}`;
        return { success: true, twoFactorRequired: false };
      }
      return { success: false };
    } catch (error) {
      console.error("Erro no login (fator 1):", error);
      return { success: false };
    }
  };

  const loginWith2FA = async (token: string) => {
    if (!userIdFor2FA) return { success: false };
    try {
      const response = await loginWithTwoFactor({ userId: userIdFor2FA, token });
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setToken(response.accessToken);
      api.defaults.headers.Authorization = `Bearer ${response.accessToken}`;
      setUserIdFor2FA(null);
      return { success: true };
    } catch (error) {
      console.error("Erro no login (fator 2):", error);
      return { success: false };
    }
  };

  const logoutUser = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    delete api.defaults.headers.Authorization;
  };

  const contextValue: AuthContextType = {
    isAuthenticated: !!token,
    user,
    token,
    loading,
    login,
    loginWith2FA,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};