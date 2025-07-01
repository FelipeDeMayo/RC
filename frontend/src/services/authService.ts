import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface TwoFactorRequiredResponse {
  twoFactorRequired: true;
  userId: number;
}

export interface LoginSuccessResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type LoginApiResponse = LoginSuccessResponse | TwoFactorRequiredResponse;

// --- FUNÇÕES DE SERVIÇO ---

export async function login(data: { email: string; password: string }): Promise<LoginApiResponse> {
  const response = await api.post<LoginApiResponse>('/auth/login', data);
  return response.data;
}

export async function loginWithTwoFactor(data: { userId: number; token: string }): Promise<LoginSuccessResponse> {
  const response = await api.post<LoginSuccessResponse>('/auth/2fa/login', data);
  return response.data;
}

// ADICIONE ESTAS DUAS NOVAS FUNÇÕES PARA O SETUP DO 2FA
export async function generateTwoFactorSecret(): Promise<{ secret: string; otpauth: string; }> {
  const response = await api.post('/auth/2fa/generate');
  return response.data;
}

export async function verifyTwoFactor(token: string): Promise<{ message: string; }> {
  const response = await api.post('/auth/2fa/verify', { token });
  return response.data;
}

export async function register(data: any): Promise<any> {
  const response = await api.post('/auth/register', data);
  return response.data;
}