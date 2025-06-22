import styled from 'styled-components'

export const ProductContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`

export const ProductImage = styled.img`
  width: 100%;
  max-height: 450px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 1rem;
`

export const ProductTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`

export const ProductDescription = styled.p`
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 1rem;
`

export const ProductPrice = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`

export const AddToCartButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: #111;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`
