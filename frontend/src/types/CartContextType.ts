import { createContext } from 'react';
import type { Product } from '../types/Product'; 

export interface ProductWithQuantity extends Product {
  quantity: number;
}

export interface CartContextType {
  cartItems: ProductWithQuantity[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => void; 
}

export const CartContext = createContext<CartContextType | undefined>(undefined);