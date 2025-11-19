import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

import {
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  CTAButton,
  ProductsSection,
  SectionTitle,
  ProductsGrid
} from '../styles/HomePageStyles';

import { useAuth } from '../contexts/useAuth';
import { useCart } from '../hooks/useCart';
import { getAllProducts } from '../services/productService';
import type { Product } from '../types/Product';

import ProductCard from '../components/ProductCard';
import TwoFactorPrompt from '../components/TwoFactorPrompt';

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
    <>
      <HeroSection>
        <HeroTitle>Sua Jornada Fitness Começa Aqui</HeroTitle>
        <HeroSubtitle>
          Equipamentos de alta qualidade para levar o seu treino para o próximo nível.
        </HeroSubtitle>
        <CTAButton href="#products">
          Ver Produtos
          <FaArrowRight />
        </CTAButton>
      </HeroSection>

      <ProductsSection id="products">
        <SectionTitle>Nossos Destaques</SectionTitle>

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
            <p>A carregar produtos...</p>
          )}
        </ProductsGrid>
      </ProductsSection>
    </>
  );
};

export default HomePage;
