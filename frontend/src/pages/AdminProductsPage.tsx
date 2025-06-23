import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import {
  Container,
  Title,
  Form,
  Input,
  Button,
  ProductsList,
  ProductCard,
  ProductTitle,
  ProductPrice,
  ProductDescription,
  ProductImage,
  Actions,
  ActionButton,
} from '../styles/AdminProductPage'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', description: '', price: '' })
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    fetch('http://localhost:3000/pruducts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error('Erro ao buscar produtos:', err))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.description || !form.price) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('price', form.price)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    const method = editingProduct ? 'PUT' : 'POST'
    const url = editingProduct
      ? `http://localhost:3000/api/products/${editingProduct.id}`
      : 'http://localhost:3000/api/products'

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao salvar produto')
        return res.json()
      })
      .then(() => {
        setForm({ name: '', description: '', price: '' })
        setImageFile(null)
        setEditingProduct(null)
        fetchProducts()
      })
      .catch((err) => console.error('Erro ao salvar produto:', err))
  }

  const handleDelete = (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return

    fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => setProducts(products.filter((p) => p.id !== id)))
      .catch((err) => console.error('Erro ao deletar produto:', err))
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
    })
    setImageFile(null)
  }

  return (
    <Container>
      <Title>Painel de Produtos (Admin)</Title>

      <Form onSubmit={handleSubmit}>
        <Input
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          required
        />
        <Input
          name="price"
          type="number"
          placeholder="Preço"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: '1rem' }}
        />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit">
            {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
          </Button>
          {editingProduct && (
            <Button
              cancel
              type="button"
              onClick={() => {
                setEditingProduct(null)
                setForm({ name: '', description: '', price: '' })
                setImageFile(null)
              }}
            >
              Cancelar Edição
            </Button>
          )}
        </div>
      </Form>

      <ProductsList>
        {products.map((product) => (
          <ProductCard key={product.id}>
            {product.image && (
              <ProductImage
                src={`http://localhost:3000/uploads/${product.image}`}
                alt={product.name}
              />
            )}
            <div>
              <ProductTitle>
                {product.name}{' '}
                <ProductPrice>R$ {product.price.toFixed(2)}</ProductPrice>
              </ProductTitle>
              <ProductDescription>{product.description}</ProductDescription>
            </div>
            <Actions>
              <ActionButton onClick={() => handleEdit(product)}>Editar</ActionButton>
              <ActionButton onClick={() => handleDelete(product.id)}>Excluir</ActionButton>
            </Actions>
          </ProductCard>
        ))}
      </ProductsList>
    </Container>
  )
}

export default AdminProductsPage
