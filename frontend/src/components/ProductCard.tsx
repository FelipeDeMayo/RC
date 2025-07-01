import { Link } from 'react-router-dom'
import {
  Card,
  Image,
  Title,
  Description,
  Price,
  AddButton,
  ImageWrapper
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
        <ImageWrapper>
          {image && <Image src={imageUrl} alt={name} />}
        </ImageWrapper>
        <Title>{name}</Title>
        <Description>{description}</Description>
        <Price>
          {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Price>

        {onAddToCart && (
          <AddButton
            onClick={e => {
              e.preventDefault()
              onAddToCart()
            }}
          >
            Adicionar ao carrinho
          </AddButton>
        )}
      </Card>
    </Link>
  )
}

export default ProductCard
