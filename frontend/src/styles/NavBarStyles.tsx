import styled from 'styled-components'

interface NavButtonProps {
  color?: string
}

export const NavButton = styled.button<NavButtonProps>`
  background-color: transparent;
  border: none;
  min-width: 120px;
  text-align: center;
  color: ${({ color }) => color || '#3f8cff'};
  font-weight: bold;
  cursor: pointer;
  padding: 8px 12px;
  transition: 0.3s ease;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    opacity: 0.9;
  }

  &.cart {
    margin-right: auto;
  }
`

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: #333;
  &:hover {
    color: #ff6600;
    transition: 0.3s ease;
  }
`
export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    background: #fff;
    position: absolute;
    top: 60px;
    right: 0;
    width: 100%;
    padding: 1rem;
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