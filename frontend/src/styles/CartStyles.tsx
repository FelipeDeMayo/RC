import styled from 'styled-components';

export const CartContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px; /* Bordas um pouco mais arredondadas */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* Sombra mais pronunciada */
`;

export const Title = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  margin-bottom: 2rem;
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: 2.2rem; /* Um pouco maior */
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.05); /* Sombra subtil no título */
`;

export const CartItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const CartItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

export const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1); /* Sombra na imagem ao passar o rato */
  }
`;

export const ItemDetails = styled.div`
  flex-grow: 1;
`;

export const ItemName = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ItemPrice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const QuantityDisplay = styled.span`
  font-weight: 600;
  min-width: 25px;
  text-align: center;
  font-size: 1.1rem;
`;

export const CartSummary = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
`;

export const TotalPrice = styled.h3`
  text-align: right;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
`;

export const ClearCartButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export const CheckoutButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* Sombra subtil no botão principal */

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px); /* Efeito de "levantar" */
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* Sombra mais forte no hover */
  }
`;

export const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    text-decoration: underline;
  }
`;
