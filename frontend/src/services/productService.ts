import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

export const getAllProducts = async () => {
  const response = await api.get('/products')
  return response.data
}

export const getProductById = async (id: number) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}
