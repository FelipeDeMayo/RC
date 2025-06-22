import { addItemToCart, getCart, removeItemFromCart as apiRemoveItem } from '../services/cartService';
import { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
};

type BackendCartItem = {
  productId: number;
  quantity: number;
  product: Product;
};

type ProductWithQuantity = Product & {
  quantity: number;
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([]);

  useEffect(() => {
    async function loadCart() {
      try {
        const backendCart = await getCart();
        setCartItems(
          backendCart.items.map((item: BackendCartItem) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          }))
        );
      } catch (error) {
        console.error('Erro ao carregar carrinho', error);
      }
    }
    loadCart();
  }, []);

  const addToCart = async (product: Product) => {
    try {
      await addItemToCart(product.id, 1);
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });
    } catch (error) {
      alert('Erro ao adicionar produto no carrinho');
      console.error(error);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await apiRemoveItem(productId);
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      alert('Erro ao remover item do carrinho');
      console.error(error);
    }
  };

  const clearCart = () => setCartItems([]);

  return { cartItems, addToCart, removeFromCart, clearCart };
};
