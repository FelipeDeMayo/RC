import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface NavButtonProps {
  color?: string
}

export const NavButton = styled.button<NavButtonProps>`
  background-color: transparent;
  border: none;
  min-width: 120px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  padding: 8px 12px;
  transition: 0.3s ease;
  white-space: nowrap;
  border-radius: 8px;

  color: ${({ color }) => color || '#FF69B4'};

  text-decoration: none;
  outline: none;

  &:focus,
  &:active {
    outline: none;
    text-decoration: none;
    box-shadow: none;
  }

  &:hover {
    text-decoration: none;
    opacity: 0.95;
    transform: scale(1.02);
  }

  &.cart {
    margin-right: auto;
    color: #C2185B;
  }

  &.login {
    background-color: #FF69B4;
    color: white;
  }

  &.login:hover {
    background-color: #C2185B;
  }

  &.register {
    background-color: #FFD6E8;
    color: #C2185B;
  }

  &.register:hover {
    background-color: #FFB6D0;
  }

  &.logout {
    background-color: #C2185B;
    color: white;
  }

  &.logout:hover {
    background-color: #A11045;
  }
`

export const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: #C2185B;
  user-select: none;

  &:hover {
    color: #FF69B4;
    transition: 0.3s ease;
  }
`

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    background: white;
    position: absolute;
    top: 60px;
    right: 0;
    width: 100%;
    padding: 1rem;
  }
`

export const LogoLink = styled(Link)`
  color: #C2185B;
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: #FF69B4;
    transition: 0.3s ease;
  }

  &:focus,
  &:active,
  &:visited {
    outline: none;
    box-shadow: none;
    text-decoration: none;
    color: #C2185B;
  }
`
