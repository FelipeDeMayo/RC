import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: ${({ theme }) => theme.fonts.body};
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Form = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const Button = styled.button<{ cancel?: boolean }>`
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: ${({ theme, cancel }) => (cancel ? theme.colors.danger : theme.colors.secondary)};
  color: ${({ theme }) => theme.colors.white};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme, cancel }) => (cancel ? theme.colors.dangerHover : theme.colors.secondaryHover)};
  }
`;

export const ProductsList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const ProductCard = styled.li`
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ProductTitle = styled.strong`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.3rem;
`;

export const ProductPrice = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.success};
  margin-left: 0.5rem;
`;

export const ProductDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  flex-grow: 1;
`;

export const ProductImage = styled.img`
  width: 100%;
  max-height: 140px;
  object-fit: contain;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const ActionButton = styled.button`
  flex: 1;
`;