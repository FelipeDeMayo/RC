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