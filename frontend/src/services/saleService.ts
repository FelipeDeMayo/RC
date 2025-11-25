import api from './api';

export const checkout = async () => {
  const response = await api.post('/api/sales/checkout');
  return response.data;
};

export const fetchMyOrders = async () => {
  const response = await api.get('/api/sales/history');
  return response.data;
};

export const fetchAllSalesAdmin = async () => {
  const response = await api.get('/api/sales/admin/sales');
  return response.data;
};