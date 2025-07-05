import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Imports dos seus hooks, serviços e tipos
import { useAuth } from '../contexts/useAuth';
import { useCart } from '../hooks/useCart';
import { getAllProducts } from '../services/productService';
import type { Product } from '../types/Product';

// Componentes
import ProductCard from '../components/ProductCard';
import TwoFactorPrompt from '../components/TwoFactorPrompt';

// --- Estilos Usados na Página ---
const Container = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 1rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

// --- Componente da Página ---
const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container style={{ paddingTop: '100px' }}>
      <Title>
        {user ? `Bem-vindo, ${user.name}!` : 'Produtos disponíveis:'}
      </Title>

      {isAuthenticated && user && !user.isTwoFactorEnabled && (
        <TwoFactorPrompt />
      )}

      <ProductsGrid>
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
              onAddToCart={() => addToCart(product)}
            />
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </ProductsGrid>
    </Container>
  );
};

export default HomePage;