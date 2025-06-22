import styled from 'styled-components'

export const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  width: 250px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`

export const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`

export const Title = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: #333;
`

export const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`

export const Price = styled.strong`
  font-size: 1rem;
  color: #000;
`
