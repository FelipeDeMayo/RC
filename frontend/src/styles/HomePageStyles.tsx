import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 2rem;
  text-align: center;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
`

export const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`

export const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #fff;

  &.login {
    background-color: #007bff;
  }

  &.login:hover {
    background-color: #0056b3;
  }

  &.register {
    background-color: #28a745;
  }

  &.register:hover {
    background-color: #1e7e34;
  }
  &.logout {
    background-color: #e74c3c; /* vermelho */
    color: white;

    &:hover {
      background-color: #c0392b;
    }
  }
`

export const TopBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff; /* fundo branco ou o que quiser */
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`


