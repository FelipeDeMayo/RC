import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { CartContext, type CartContextType, type ProductWithQuantity } from './CartContextType';
import { getCart, addItemToCart, removeItemFromCart, type CartItemResponse, clearCartFromApi  } from '../services/cartService';
import type { Product } from '../types/Product';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([]);
  const [loading, setLoading] = useState(true);

  const handleUnauthorized = useCallback(() => {
    localStorage.clear();
    window.location.href = '/login';
  }, []);

  const loadCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setCartItems([]);
      return;
    }
    
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
    loadCart();
  }, [loadCart]);

  const addToCart = async (product: Product) => {
    try {
      await addItemToCart(product.id, 1);
      await loadCart();
    } catch (error) {
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
      if (error instanceof Error && String(error).includes('401')) {
        handleUnauthorized();
      }
    }
  };

  const clearCart = async () => {
  try {
    await clearCartFromApi();
    setCartItems([]); // Limpa o estado local após o sucesso
  } catch (error) {
    console.error('Erro ao limpar o carrinho no backend:', error);
  }
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