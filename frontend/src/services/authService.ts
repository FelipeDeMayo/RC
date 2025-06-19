import api from './api'

export interface LoginData {
  email: string
  password: string
}

export const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data)
  return response.data
}
