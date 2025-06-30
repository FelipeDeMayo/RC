// src/styles/HeaderStyles.ts

import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

interface NavButtonProps {
  $variant?: 'primary' | 'secondary' | 'ghost'; 
}

export const NavButton = styled.button<NavButtonProps>`
  border: 2px solid transparent;
  min-width: 120px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  padding: 8px 16px;
  transition: all 0.3s ease;
  white-space: nowrap;
  border-radius: 8px;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:focus,
  &:active {
    outline: none;
    box-shadow: none;
  }

  ${({ $variant, theme }) => { 
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          &:hover {
            opacity: 0.9;
            transform: scale(1.02);
          }
        `;
      case 'secondary':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.white};
            transform: scale(1.02);
          }
        `;
      case 'ghost':
      default:
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.background};
            transform: scale(1.02);
          }
        `;
    }
  }}
`;

// ...resto do seu arquivo...

export const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const LogoLink = styled(Link)`
  color: #C2185B;
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  user-select: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #FF69B4;
  }
`;

export const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  .user-greeting {
    color: #555;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    display: none;
    
    &.active {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      background: white;
      position: absolute;
      top: 70px; 
      right: 0;
      width: 100%;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  }
`;

export const HamburgerButton = styled.button`
  display: none; 
  background: transparent;
  border: none;
  color: #C2185B;
  cursor: pointer;
  z-index: 1001; 

  @media (max-width: 768px) {
    display: block;
  }
`;

// ADICIONADO: Estilo para o contêiner do botão do carrinho
export const CartButtonWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #c2185b;
`;

// ADICIONADO: Estilo para o número de itens no carrinho
export const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #c2185b;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border: 2px solid white;
`;