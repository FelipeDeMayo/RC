import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types/Product'
import { CartContext, type CartContextType, type ProductWithQuantity } from './CartContextType'
import { useAuth } from '../contexts/useAuth'
import { getCart, addItemToCart, removeItemFromCart } from '../services/cartService'

type Props = {
  children: ReactNode
}

export const CartProvider = ({ children }: Props) => {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCartItems([])
        localStorage.removeItem('cart')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const items = await getCart()
        setCartItems(items)
      } catch (error) {
        console.error('Erro ao carregar carrinho do backend:', error)
        setCartItems([])
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [user])

  const addToCart = async (product: Product) => {
    try {
      await addItemToCart(product.id, 1)
      setCartItems(prev => {
        const existing = prev.find(p => p.id === product.id)
        if (existing) {
          return prev.map(p =>
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
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
        prev.flatMap(item => {
          if (item.id === id) {
            if (item.quantity > 1) {
              return [{ ...item, quantity: item.quantity - 1 }]
            } else {
              return []
            }
          }
          return [item]
        })
      )
    } catch (error) {
      console.error('Erro ao remover item no backend:', error)
    }
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  if (loading) return <p>Carregando carrinho...</p>

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
