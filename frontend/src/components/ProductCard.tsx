import { Link } from 'react-router-dom'
import { Card, Image, Title, Description, Price } from './ProductCardStyles'

interface ProductCardProps {
  id: number
  name: string
  description: string
  price: number
  image?: string
}

export const ProductCard = ({ id, name, description, price, image }: ProductCardProps) => {
  const imageUrl = image?.startsWith('http')
    ? image
    : `http://localhost:3000/uploads/${image}`

  return (
    <Link to={`/produto/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card>
        {image && <Image src={imageUrl} alt={name} />}
        <Title>{name}</Title>
        <Description>{description}</Description>
        <Price>R$ {price.toFixed(2)}</Price>
      </Card>
    </Link>
  )
}
