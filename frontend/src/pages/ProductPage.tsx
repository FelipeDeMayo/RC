import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProductById } from '../services/productService'

type Product = {
  id: number
  title: string
  description: string
  price: number
  imageUrl?: string
}

const ProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{product.title}</h1>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.title} width="300" />
      )}
      <p>{product.description}</p>
      <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
      <button>Adicionar ao carrinho</button>
    </div>
  )
}

export default ProductPage
