import { createContext } from 'react';
import type { Product } from '../types/Product';

export type ProductWithQuantity = Product & { quantity: number };

export type CartContextType = {
  cartItems: ProductWithQuantity[];
  loading: boolean;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);