import styled from 'styled-components';

export const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

export const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
`;


export const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3; 
  position: relative;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 10px;
`;


export const Title = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

export const Description = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.75rem;
`;

export const Price = styled.strong`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 1rem;
`;

export const AddButton = styled.button`
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  border: none;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryHover};
  }
`;