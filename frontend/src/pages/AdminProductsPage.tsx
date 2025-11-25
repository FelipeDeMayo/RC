import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';

import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  bulkImportProducts,
} from '../services/productService'; 

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
} from '../styles/AdminProductPage';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock?: number; // <--- Adicionado o campo opcional na interface
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // <--- Adicionado 'stock' ao estado inicial
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      toast.error('Não foi possível carregar os produtos.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validação básica inclui stock agora
    if (!form.name || !form.description || !form.price || !form.stock) {
      toast.warn('Preencha todos os campos obrigatórios');
      return;
    }
    const priceForApi = form.price.replace(',', '.');
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', priceForApi);
    formData.append('stock', form.stock); // <--- Enviando o estoque

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await createProduct(formData);
        toast.success('Produto criado com sucesso!');
      }
      // Limpa o formulário
      setForm({ name: '', description: '', price: '', stock: '' });
      setImageFile(null);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      toast.error('Falha ao salvar produto.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Produto deletado com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      toast.error('Falha ao deletar produto.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price).replace('.', ','),
      stock: String(product.stock || 0), // <--- Carrega o estoque atual para edição
    });
    setImageFile(null);
    window.scrollTo(0, 0);
  };

  const handleImportFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      return toast.error('Por favor, selecione um arquivo CSV.');
    }
    setIsImporting(true);
    try {
      const result = await bulkImportProducts(importFile);
      toast.success(result.message);
      setImportFile(null);
      (e.target as HTMLFormElement).reset();
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Falha na importação.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Container>
      <Title>Painel de Produtos (Admin)</Title>
      <Form onSubmit={handleSubmit}>
        <h3>{editingProduct ? 'Editar Produto' : 'Criar Novo Produto'}</h3>
        <Input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
        <Input name="description" placeholder="Descrição" value={form.description} onChange={handleChange} required />
        
        {/* Layout Flex para Preço e Estoque ficarem lado a lado */}
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Input 
                style={{ flex: 1 }}
                name="price" 
                type="text" 
                inputMode="decimal" 
                placeholder="Preço (ex: 1045,55)" 
                value={form.price} 
                onChange={handleChange} 
                required 
            />
            <Input 
                style={{ flex: 1 }}
                name="stock" 
                type="number" 
                placeholder="Estoque (Qtd)" 
                value={form.stock} 
                onChange={handleChange} 
                required 
            />
        </div>

        <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '1rem' }} />
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit">
            {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
          </Button>
          {editingProduct && (
            <Button cancel type="button" onClick={() => { setEditingProduct(null); setForm({ name: '', description: '', price: '', stock: '' }); setImageFile(null); }}>
              Cancelar Edição
            </Button>
          )}
        </div>
      </Form>

      <Form as="div" style={{ marginTop: '3rem' }}>
        <h3>Importação em Massa</h3>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Envie um arquivo `.csv` com as colunas: <strong>name, description, price, stock</strong> e (opcional) <strong>image</strong> com a URL.</p>
        <form onSubmit={handleImportSubmit} style={{ marginTop: '1rem' }}>
          <Input type="file" accept=".csv" onChange={handleImportFileChange} disabled={isImporting} />
          <Button type="submit" disabled={isImporting || !importFile} style={{ marginTop: '1rem' }}>
            {isImporting ? 'Importando...' : 'Importar Arquivo'}
          </Button>
        </form>
      </Form>

      <ProductsList>
        {products.map((product) => (
          <ProductCard key={product.id}>
            {product.image && (
            <ProductImage
              src={
                product.image.startsWith('http')
                  ? product.image
                  : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/${product.image}`
              }
              alt={product.name}
            />
            )}
            <div>
              <ProductTitle>
                {product.name}{' '}
                <ProductPrice>
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </ProductPrice>
              </ProductTitle>
              <ProductDescription>{product.description}</ProductDescription>
              
              {/* Exibe o estoque no card */}
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                Estoque: <strong>{product.stock ?? 0}</strong> unidades
              </p>

            </div>
            <Actions>
              <ActionButton onClick={() => handleEdit(product)}>Editar</ActionButton>
              <ActionButton onClick={() => handleDelete(product.id)}>Excluir</ActionButton>
            </Actions>
          </ProductCard>
        ))}
      </ProductsList>
    </Container>
  );
};

export default AdminProductsPage;