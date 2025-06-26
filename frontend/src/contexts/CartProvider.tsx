// src/contexts/CartProvider.tsx

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types/Product'
import { CartContext, type CartContextType, type ProductWithQuantity } from './CartContextType'
import { useAuth } from '../contexts/useAuth'
import { getCart, addItemToCart, removeItemFromCart, type CartItemResponse } from '../services/cartService'

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
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const cartData = await getCart();

        // **A CORREÇÃO ESTÁ AQUI**
        // Verificamos se a resposta da API tem o formato esperado antes de usá-la.
        if (cartData && Array.isArray(cartData.items)) {
          const formattedItems = cartData.items.map((apiItem: CartItemResponse) => ({
            id: apiItem.productId,
            name: apiItem.name,
            price: apiItem.price,
            description: '',
            image: apiItem.image,
            quantity: apiItem.quantity
          }));
          setCartItems(formattedItems);
        } else {
          // Se a API não retornar um carrinho (ex: usuário novo), definimos como vazio.
          setCartItems([]);
        }

      } catch (error) {
        console.error('Erro ao carregar carrinho do backend:', error)
        setCartItems([])
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [user])

  // As funções abaixo não precisam de alteração
  const addToCart = async (product: Product) => {
    try {
      await addItemToCart(product.id, 1)
      setCartItems(prev => {
        const exists = prev.find(p => p.id === product.id)
        if (exists) {
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
            return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []
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