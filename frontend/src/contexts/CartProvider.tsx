import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { CartContext, type CartContextType, type ProductWithQuantity } from './CartContextType';
import { getCart, addItemToCart, removeItemFromCart, clearCartFromApi, type CartItemResponse } from '../services/cartService';
import type { Product } from '../types/Product';
import { useAuth } from './useAuth';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      setLoading(false);
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
        setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product: Product) => {
    try {
      await addItemToCart(product.id, 1);
      await loadCart();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      await removeItemFromCart(id);
      await loadCart();
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartFromApi();
      await loadCart();
    } catch(error) {
      console.error('Erro ao limpar carrinho:', error);
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