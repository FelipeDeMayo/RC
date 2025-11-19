import styled from 'styled-components';

export const HeroSection = styled.section`
  background: 
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
    /* SUBSTITUA A URL AQUI */
    url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975');
  
  background-size: cover;
  background-position: center;
  color: ${({ theme }) => theme.colors.white};
  padding: 8rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.white};
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin-bottom: 2.5rem;
  font-family: ${({ theme }) => theme.fonts.body};
`;

export const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 2.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const ProductsSection = styled.section`
  padding: 4rem 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
`;

// TÍTULO DA SECÇÃO MELHORADO
export const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem; /* Leve ajuste no tamanho */
  font-weight: 700;
  text-transform: uppercase; /* Deixa o texto em maiúsculas para mais impacto */
  letter-spacing: 1.5px; /* Aumenta o espaçamento entre as letras */
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.primary}; /* Usa a cor primária do seu tema */
  position: relative;
  padding-bottom: 1rem; /* Cria espaço para a linha abaixo */

  /* Linha decorativa para dar mais destaque */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px; /* Largura da linha */
    height: 4px; /* Espessura da linha */
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }
`;

export const ProductsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;
