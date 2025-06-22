const API_URL = 'http://localhost:3000/cart';

const getToken = () => {
  return localStorage.getItem('token');
};

export const getCart = async () => {
  const token = getToken();
  if (!token) throw new Error('Token não encontrado');

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Erro ao buscar carrinho');
  return res.json();
};

export const addItemToCart = async (productId: number, quantity: number) => {
  const token = getToken();
  if (!token) throw new Error('Token não encontrado');

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });

  if (!res.ok) throw new Error('Erro ao adicionar item ao carrinho');
  return res.json();
};

export const removeItemFromCart = async (productId: number) => {
  const token = getToken();
  if (!token) throw new Error('Token não encontrado');

  const res = await fetch(`${API_URL}/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Erro ao remover item');
  return res.json();
};
