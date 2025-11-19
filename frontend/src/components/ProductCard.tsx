import { Link } from 'react-router-dom';
import {
  Card,
  ImageWrapper,
  Image,
  ContentWrapper,
  Title,
  Description,
  Price,
  AddButton
} from '../styles/ProductCardStyles';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  onAddToCart?: () => void;
}

const ProductCard = ({ id, name, description, price, image, onAddToCart }: ProductCardProps) => {
  const imageUrl = image && image.startsWith('http')
    ? image
    : `http://localhost:3000/${image}`;

  return (
    <Card>
      <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ImageWrapper>
          {image && <Image src={imageUrl} alt={name} />}
        </ImageWrapper>
      </Link>
      
      <ContentWrapper>
        <Title>{name}</Title>
        <Description>{description}</Description>
        <Price>
          {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Price>
        {onAddToCart && (
          <AddButton onClick={onAddToCart}>
            Adicionar ao carrinho
          </AddButton>
        )}
      </ContentWrapper>
    </Card>
  );
};

export default ProductCard;