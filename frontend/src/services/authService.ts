import api from './api'

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  token?: string
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string; 
  user: User;
}


export async function login(data: { email: string; password: string }): Promise<User> {
  const response = await api.post<LoginResponse>('/auth/login', data);
  console.log('🔍 Resposta da API de login:', response.data)

  const { accessToken, refreshToken, user } = response.data
  const userWithToken: User = { ...user, token: accessToken }

  localStorage.setItem('token', accessToken)
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(userWithToken))

  return userWithToken
}

export async function register(data: RegisterPayload): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>('/auth/register', data)
  return response.data
}
