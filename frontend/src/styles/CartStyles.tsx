import styled from 'styled-components'

export const CartContainer = styled.div`
  position: fixed;
  top: 80px;  
  right: 0;
  width: 320px;
  height: calc(100vh - 80px);
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0,0,0,0.15);
  z-index: 1100;  
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

export const CartHeader = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`

export const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export const EmptyCartMessage = styled.p`
  color: #666;
  text-align: center;
  margin-top: 2rem;
`
