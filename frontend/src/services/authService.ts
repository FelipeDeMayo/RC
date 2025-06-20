import api from './api'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data)
  console.log('Resposta da API:', response.data)

  const { token, user } = response.data

  if (!user) {
    console.warn('Usuário não retornado da API')
    throw new Error('Usuário inválido')
  }

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return user
}


export async function registerUser(data: RegisterData) {
  const response = await api.post('/auth/register', data)
  return response.data
}
