import React from 'react'
import {
  CartContainer,
  Title,
  CartItem,
  EmptyCartMessage
} from '../styles/CartStyles'

interface CartItemType {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartProps {
  items: CartItemType[]
}

const Cart: React.FC<CartProps> = ({ items }) => {
  return (
    <CartContainer>
      <Title>Seu Carrinho</Title>

      {items.length === 0 ? (
        <EmptyCartMessage>Seu carrinho está vazio</EmptyCartMessage>
      ) : (
        items.map((item) => (
          <CartItem key={item.id}>
            <span>{item.name} x {item.quantity}</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </CartItem>
        ))
      )}
    </CartContainer>
  )
}

export default Cart
