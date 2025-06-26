import { useState, useEffect, useCallback } from 'react';
import { CartContext, type CartContextType, type ProductWithQuantity } from './CartContextType';
import { getCart, addItemToCart, removeItemFromCart, type CartItemResponse } from '../services/cartService';
import type { Product } from '../types/Product';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([]);
  const [loading, setLoading] = useState(true);

  const handleUnauthorized = useCallback(() => {
    // Limpa o estado de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }, []);

  const loadCart = useCallback(async () => {
    // Esta função busca os dados do backend e atualiza o estado local
    try {
      setLoading(true);
      const cartResponse = await getCart();

      if (cartResponse && Array.isArray(cartResponse.items)) {
        const formattedItems = cartResponse.items.map((apiItem: CartItemResponse) => ({
          id: apiItem.productId,
          name: apiItem.name,
          price: apiItem.price,
          quantity: apiItem.quantity,
          image: apiItem.image,
          description: '',
        }));
        setCartItems(formattedItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do backend:', error);
      if (error instanceof Error && String(error).includes('401')) {
        handleUnauthorized();
      } else {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCart();
    } else {
      setLoading(false);
      setCartItems([]);
    }
  }, [loadCart]);

  const addToCart = async (product: Product) => {
    try {
      await addItemToCart(product.id, 1);
      await loadCart(); 
    } catch (error) {
      console.error('Erro ao adicionar item no backend:', error);
      if (error instanceof Error && String(error).includes('401')) {
        handleUnauthorized();
      }
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      await removeItemFromCart(id);
      await loadCart(); 
    } catch (error) {
      console.error('Erro ao remover item no backend:', error);
      if (error instanceof Error && String(error).includes('401')) {
        handleUnauthorized();
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };
  const contextValue: CartContextType = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};