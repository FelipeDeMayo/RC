import api from './api';

// Função para buscar TODOS os produtos
export const getAllProducts = async () => {
  // 2. Usamos o caminho completo aqui, incluindo o prefixo /api
  const response = await api.get('/api/products');
  return response.data;
}
// Função para CRIAR um produto
export const createProduct = async (productData: FormData) => {
  const response = await api.post('/api/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Função para buscar UM produto pelo ID
export const getProductById = async (id: number) => {
  // Usamos o caminho completo aqui também
  const response = await api.get(`/api/products/${id}`); 
  return response.data;
}

// Função para DELETAR um produto
export const deleteProduct = async (id: number) => {
  // O interceptor vai adicionar o token de admin automaticamente
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
}

// Função para ATUALIZAR um produto
export const updateProduct = async (id: number, productData: FormData) => {
  // O interceptor vai adicionar o token de admin automaticamente
  const response = await api.put(`/api/products/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export const bulkImportProducts = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/products/bulk-import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};