import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProductById } from '../services/productService'
import { useCart } from '../contexts/useCart'
import {
  ProductContainer,
  ProductImage,
  ProductTitle,
  ProductDescription,
  ProductPrice,
  AddToCartButton
} from '../styles/ProductCardPageStyles'

type Product = {
  id: number
  name: string
  description: string
  price: number
  image?: string
}

const ProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const { addToCart } = useCart() 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await getProductById(Number(id))
          setProduct(data)
        }
      } catch (err) {
        console.error('Erro ao buscar produto:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <p>Carregando produto...</p>
  if (!product) return <p>Produto não encontrado.</p>

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `http://localhost:3000/uploads/${product.image}`

  return (
    <ProductContainer>
      <ProductTitle>{product.name}</ProductTitle>
      {product.image && (
        <ProductImage src={imageUrl} alt={product.name} />
      )}
      <ProductDescription>{product.description}</ProductDescription>
      <ProductPrice>R$ {product.price.toFixed(2)}</ProductPrice>
      <AddToCartButton onClick={() => addToCart(product)}>
        Adicionar ao carrinho
      </AddToCartButton>
    </ProductContainer>
  )
}

export default ProductPage
