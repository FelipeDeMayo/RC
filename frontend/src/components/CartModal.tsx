import React from 'react'
import styled from 'styled-components'

const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
`

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
`

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const Total = styled.div`
  font-weight: 700;
  font-size: 1.3rem;
  margin-top: 1rem;
  text-align: right;
`

interface CartItemType {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartModalProps {
  items: CartItemType[]
  onClose: () => void
}

const CartModal: React.FC<CartModalProps> = ({ items, onClose }) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <Backdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Seu Carrinho</h2>
        {items.length === 0 && <p>Seu carrinho está vazio.</p>}

        {items.map(item => (
          <CartItem key={item.id}>
            <span>{item.name} x {item.quantity}</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </CartItem>
        ))}

        <Total>Total: R$ {total.toFixed(2)}</Total>
        <button onClick={onClose} style={{marginTop: '1rem'}}>Fechar</button>
      </ModalContent>
    </Backdrop>
  )
}

export default CartModal
