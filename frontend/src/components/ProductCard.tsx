import { Link } from 'react-router-dom'
import {
  Card,
  Image,
  Title,
  Description,
  Price
} from '../styles/ProductCardStyles'

interface ProductCardProps {
  id: number
  name: string
  description: string
  price: number
  image?: string
  onAddToCart?: () => void
}

const ProductCard = ({ id, name, description, price, image, onAddToCart }: ProductCardProps) => {
  const imageUrl = image?.startsWith('http')
    ? image
    : `http://localhost:3000/uploads/${image}`

  return (
    <Link
      to={`/product/${id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Card>
        {image && <Image src={imageUrl} alt={name} />}
        <Title>{name}</Title>
        <Description>{description}</Description>
        <Price>R$ {price.toFixed(2)}</Price>

        {onAddToCart && (
          <button
            onClick={e => {
              e.preventDefault() 
              onAddToCart()
            }}
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              backgroundColor: '#007bff',
              border: 'none',
              color: '#fff',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Adicionar ao carrinho
          </button>
        )}
      </Card>
    </Link>
  )
}

export default ProductCard
