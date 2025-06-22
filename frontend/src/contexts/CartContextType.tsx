import { createContext } from 'react'
import type { Product } from '../types/Product'

export type ProductWithQuantity = Product & { quantity: number }

export type CartContextType = {
  cartItems: ProductWithQuantity[]
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)
