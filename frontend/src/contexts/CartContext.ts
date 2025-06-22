import { createContext } from 'react'
import type { Product } from '../types/Product'

export type CartContextType = {
  cartItems: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)
