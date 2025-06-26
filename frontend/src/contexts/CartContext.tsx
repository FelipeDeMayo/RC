import { useState, useEffect, useCallback } from 'react';
import { CartContext, type CartContextType, type ProductWithQuantity } from './CartContextType';
import { getCart, addItemToCart, removeItemFromCart, type CartItemResponse } from '../services/cartService';
import type { Product } from '../types/Product';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([]);
  const [loading, setLoading] = useState(true);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartResponse = await getCart();

        const formattedItems = cartResponse.items.map((apiItem: CartItemResponse) => ({
          // Transformando os dados da API para o formato do Frontend:
          id: apiItem.productId,
          name: apiItem.name,
          price: apiItem.price,
          quantity: apiItem.quantity,
          image: apiItem.image,
          description: '',
        }));

        setCartItems(formattedItems);

      } catch (error) {
        console.error('Erro ao carregar carrinho do backend:', error);
        if (error instanceof Error && error.message.includes('401')) {
          handleUnauthorized();
        }
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [handleUnauthorized]);

  const addToCart = async (product: Product) => {
    try {
      await addItemToCart(product.id, 1);
      setCartItems(prev => {
        const exists = prev.find(item => item.id === product.id);
        if (exists) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    } catch (error) {
      console.error('Erro ao adicionar item no backend:', error);
      if (error instanceof Error && error.message.includes('401')) {
        handleUnauthorized();
      }
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      await removeItemFromCart(id);
      setCartItems(prev =>
        prev
          .map(item => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
          .filter(item => item.quantity > 0)
      );
    } catch (error) {
      console.error('Erro ao remover item no backend:', error);
      if (error instanceof Error && error.message.includes('401')) {
        handleUnauthorized();
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  if (loading) {
    return <p>Carregando carrinho...</p>;
  }

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};