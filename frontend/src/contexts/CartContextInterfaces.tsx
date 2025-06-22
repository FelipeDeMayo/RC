import { useState } from 'react'
import type { ReactNode } from 'react'
import { CartContext } from './CartContextType'
import type { CartContextType, ProductWithQuantity } from './CartContextType' 
import type { Product } from '../types/Product'

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([])

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}
