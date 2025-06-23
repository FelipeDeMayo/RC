import { useState, useEffect } from 'react'
import { CartContext, type CartContextType, type ProductWithQuantity } from './CartContextType'
import { getCart, addItemToCart, removeItemFromCart } from '../services/cartService'
import type { Product } from '../types/Product'

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await getCart()
        setCartItems(items)
      } catch (error) {
        console.error('Erro ao carregar carrinho do backend:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [])

  const addToCart = async (product: Product) => {
    try {
      await addItemToCart(product.id, 1)  // Removeu a variável não usada
      setCartItems(prev => {
        const exists = prev.find(item => item.id === product.id)
        if (exists) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        }
        return [...prev, { ...product, quantity: 1 }]
      })
    } catch (error) {
      console.error('Erro ao adicionar item no backend:', error)
    }
  }

  const removeFromCart = async (id: number) => {
    try {
      await removeItemFromCart(id)
      setCartItems(prev =>
        prev
          .map(item => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
          .filter(item => item.quantity > 0)
      )
    } catch (error) {
      console.error('Erro ao remover item no backend:', error)
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  if (loading) return <p>Carregando carrinho...</p>

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}
