const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const csv = require('csv-parser');
const cloudinary = require('../config/cloudinary');

exports.listProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'ID de produto inválido.' });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (err) {
    console.error(`Erro ao buscar produto ${productId}:`, err);
    res.status(500).json({ error: 'Erro ao buscar produto por ID' });
  }
};

exports.createProduct = async (req, res) => {
  // Recebe o 'stock' do corpo da requisição
  const { name, description, price, stock } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  try {
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'produtos_ecommerce',
      });
      imageUrl = result.secure_url;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock, 10) : 0,
        image: imageUrl,
        admin: { connect: { id: req.user.userId } },
      },
    });
    res.status(201).json(product);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id, 10);
  const { name, description, price, stock } = req.body;

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'ID de produto inválido.' });
  }

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado.'});
    }

    let imageUrl = existingProduct.image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'produtos_ecommerce',
      });
      imageUrl = result.secure_url;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock, 10) : existingProduct.stock,
        image: imageUrl,
      },
    });
    res.json(updatedProduct);
  } catch (err) {
    console.error(`Erro ao atualizar produto ${productId}:`, err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'ID de produto inválido.' });
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    console.error(`Erro ao deletar produto ${productId}:`, err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};

exports.bulkImportProducts = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo CSV enviado.' });
  }

  const products = [];
  const filePath = req.file.path;
  const adminId = req.user.userId;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const price = parseFloat(row.price);
      const stock = parseInt(row.stock, 10) || 0;

      if (row.name && row.description && !isNaN(price)) {
        products.push({
          name: row.name,
          description: row.description,
          price: price,
          stock: stock, 
          image: row.image || null,
          adminId: adminId,
        });
      }
    })
    .on('end', async () => {
      fs.unlinkSync(filePath);

      if (products.length === 0) {
        return res.status(400).json({
          error:
            'Arquivo CSV vazio ou mal formatado. Colunas necessárias: name, description, price. Opcional: image, stock.',
        });
      }

      try {
        const result = await prisma.product.createMany({
          data: products,
          skipDuplicates: true,
        });
        res.status(201).json({ message: `${result.count} produtos importados com sucesso.` });
      } catch (error) {
        console.error('Erro na inserção em massa:', error);
        res.status(500).json({ error: 'Falha ao salvar produtos no banco de dados.' });
      }
    });
};