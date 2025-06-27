import React from 'react'

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
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          minWidth: '300px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2>Carrinho</h2>
        {items.length === 0 && <p>Seu carrinho está vazio</p>}
        {items.map(item => (
          <div key={item.id} style={{ marginBottom: '10px' }}>
            <strong>{item.name}</strong> x {item.quantity} — R$ {item.price * item.quantity}
          </div>
        ))}

        <button onClick={onClose} style={{ marginTop: '20px' }}>Fechar</button>
      </div>
    </div>
  )
}

export default CartModal
