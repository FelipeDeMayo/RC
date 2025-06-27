import styled from 'styled-components'
import { FaUserCircle } from 'react-icons/fa'

export const Container = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  box-sizing: border-box;
`

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  padding-right: 1rem;
`

export const ProfileIcon = styled(FaUserCircle)`
  color: #007bff;
  width: 24px;
  height: 24px;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
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
