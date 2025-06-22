import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types/Product'
import { CartContext, type CartContextType, type ProductWithQuantity } from './CartContextType'

type Props = {
  children: ReactNode
}

export const CartProvider = ({ children }: Props) => {
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) setCartItems(JSON.parse(storedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

const removeFromCart = (id: number) => {
  setCartItems(prev => {
    return prev
      .map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity - 1
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      })
      .filter((item): item is ProductWithQuantity => item !== null)
  })
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
