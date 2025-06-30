import api from './api';

export interface CartItemResponse {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface GetCartFullResponse {
  items: CartItemResponse[];
  totalItems: number;
  totalPrice: number;
}

export const getCart = async (): Promise<GetCartFullResponse> => {
  const response = await api.get<GetCartFullResponse>('/cart');
  return response.data;
};

export const addItemToCart = async (productId: number, quantity: number): Promise<any> => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

export const removeItemFromCart = async (productId: number): Promise<any> => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

export const clearCartFromApi = async (): Promise<{ message: string }> => {
  const response = await api.delete('/cart/clear');
  return response.data;
};