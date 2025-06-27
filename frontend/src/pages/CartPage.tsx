import { useCart } from '../contexts/useCart';
import { Link } from 'react-router-dom';
import type { ProductWithQuantity } from '../contexts/CartContextType';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  // Lógica de cálculo do total, com tipos definidos. Perfeito.
  const total = cartItems.reduce(
    (acc: number, item: ProductWithQuantity) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛒 Carrinho</h2>

      {cartItems.length === 0 ? (
        <p>
          Seu carrinho está vazio. <Link to="/">Voltar às compras</Link>
        </p>
      ) : (
        <>
          <ul>
            {cartItems.map((item: ProductWithQuantity) => (
              <li key={item.id} style={{ marginBottom: '1rem' }}>
                <strong>{item.name}</strong> <br />
                Preço: R$ {item.price !== undefined ? item.price.toFixed(2) : '0.00'} <br />
                Quantidade: {item.quantity ?? 1} <br />
                <button onClick={() => removeFromCart(item.id)}>Remover</button>
              </li>
            ))}
          </ul>

          <h3>Total: R$ {total.toFixed(2)}</h3>
          <button onClick={clearCart}>🗑️ Limpar Carrinho</button>
        </>
      )}
    </div>
  );
};

export default CartPage;