import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import type { ProductWithQuantity } from '../contexts/CartContextType';

import {
  CartContainer,
  Title,
  CartItemsList,
  CartItem,
  ItemImage,
  ItemDetails,
  ItemName,
  ItemPrice,
  QuantityControl,
  QuantityButton,
  QuantityDisplay,
  CartSummary,
  TotalPrice,
  CheckoutButton,
  EmptyCartMessage
} from '../styles/CartStyles';

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, loading } = useCart();

  const total = cartItems.reduce(
    (acc: number, item: ProductWithQuantity) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const handleCheckout = () => {
    alert('Função "Finalizar Compra" a ser implementada!');
  };
  if (loading) {
    return (
      <CartContainer>
        <Title>Carregando carrinho...</Title>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <Title>🛒 Seu Carrinho</Title>
      
      {cartItems.length === 0 ? (
        <EmptyCartMessage>
          <p>Seu carrinho está vazio.</p>
          <Link to="/">Voltar às compras</Link>
        </EmptyCartMessage>
      ) : (
        <>
          <CartItemsList>
            {cartItems.map((item) => (
              <CartItem key={item.id}>
                <ItemImage
                  src={item.image ? `http://localhost:3000/uploads/${item.image}` : '/placeholder.png'}
                  alt={item.name}
                />
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>
                    {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </ItemPrice>
                </ItemDetails>
                <QuantityControl>
                  <QuantityButton onClick={() => removeFromCart(item.id)}>-</QuantityButton>
                  <QuantityDisplay>{item.quantity}</QuantityDisplay>
                  <QuantityButton onClick={() => addToCart(item)}>+</QuantityButton>
                </QuantityControl>
              </CartItem>
            ))}
          </CartItemsList>
          
          <CartSummary>
            <TotalPrice>
              Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </TotalPrice>
            <CheckoutButton onClick={handleCheckout}>
              Finalizar Compra
            </CheckoutButton>
            <button onClick={clearCart} style={{marginTop: '1rem', color: 'grey'}}>Limpar Carrinho</button>
          </CartSummary>
        </>
      )}
    </CartContainer>
  );
};

export default CartPage;