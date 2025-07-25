import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';
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
  EmptyCartMessage,
  ActionsContainer,
  ClearCartButton,
} from '../styles/CartStyles';
import { FaShoppingCart } from 'react-icons/fa';

const CartPage = () => {

  const { cartItems, addToCart, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc: number, item: ProductWithQuantity) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const handleCheckout = () => {
    
    navigate('/checkout');
  };

  if (loading) {
    return <CartContainer><Title>A carregar carrinho...</Title></CartContainer>;
  }

  return (
    <CartContainer>
      <Title><FaShoppingCart /> Seu Carrinho</Title>
      
      {cartItems.length === 0 ? (
        <EmptyCartMessage>
          <p>O seu carrinho está vazio.</p>
          <Link to="/">Voltar às compras</Link>
        </EmptyCartMessage>
      ) : (
        <>
          <CartItemsList>
            {cartItems.map((item) => (
              <CartItem key={item.id}>
                <ItemImage
                  src={item.image && item.image.startsWith('http') ? item.image : `http://localhost:3000/${item.image}`}
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
            
            <ActionsContainer>
              <ClearCartButton onClick={clearCart}>Limpar Carrinho</ClearCartButton>
              <CheckoutButton onClick={handleCheckout}>
                Finalizar Compra
              </CheckoutButton>
            </ActionsContainer>
          </CartSummary>
        </>
      )}
    </CartContainer>
  );
};

export default CartPage;
