import styled from 'styled-components'

export const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: Arial, sans-serif;
`

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #222;
`

export const Form = styled.form`
  background: #f7f7f7;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
`

export const Input = styled.input`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #4f46e5;
  }
`

export const Button = styled.button<{ cancel?: boolean }>`
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: ${props => props.cancel ? '#ef4444' : '#4f46e5'};
  color: white;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.cancel ? '#dc2626' : '#4338ca'};
  }
`

export const ProductsList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`

export const ProductCard = styled.li`
  border: 1.5px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  background: white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const ProductTitle = styled.strong`
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 0.3rem;
`

export const ProductPrice = styled.span`
  font-weight: 600;
  color: #10b981;
  margin-left: 0.5rem;
`

export const ProductDescription = styled.p`
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 1rem;
  flex-grow: 1;
`

export const ProductImage = styled.img`
  width: 100%;
  max-height: 140px;
  object-fit: contain;
  border-radius: 6px;
  margin-bottom: 1rem;
`

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`

export const ActionButton = styled.button`
  flex: 1;
`
