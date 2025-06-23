import axios from 'axios'

const token = localStorage.getItem('token')

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  }
})


export const getAllProducts = async () => {
  const response = await api.get('/api/products')
  return response.data
}

export const getProductById = async (id: number) => {
  const response = await api.get(`/api/products/${id}`)
  return response.data
}
