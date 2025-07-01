import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

interface NavButtonProps {
  $variant?: 'primary' | 'secondary' | 'ghost';
}


export const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const AuthActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;


export const NavButton = styled.button<NavButtonProps>`
  border: 2px solid transparent;
  min-width: 110px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  border-radius: 8px;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(194, 24, 91, 0.3);
  }

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.surface};
          &:hover {
            background-color: ${theme.colors.primaryHover};
          }
        `;
      case 'secondary':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};

          &:hover {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.white}; 
          }
        `;
      case 'ghost':
      default:
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.background};
          }
        `;
    }
  }}
`;

export const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 70px; 
`;

export const LogoLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
`;

export const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  .user-greeting {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 500;
  }

  @media (max-width: 768px) {
    display: none;
    
    &.active {
      display: flex;
      flex-direction: column;
      align-items: center; 
      gap: 1.5rem; 
      background-color: ${({ theme }) => theme.colors.surface};
      position: absolute;
      top: 70px;
      right: 0;
      width: 100%;
      padding: 2rem;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      ${UserActions}, ${AuthActions} {
        flex-direction: row; 
        justify-content: center;
        width: 100%;
      }
    }
  }
`;

export const HamburgerButton = styled.button`
  display: none; 
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  z-index: 1001; 

  @media (max-width: 768px) {
    display: block;
  }
`;

export const CartButtonWrapper = styled(Link)`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.surface};
`;