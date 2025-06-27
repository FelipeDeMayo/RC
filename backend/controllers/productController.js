const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');

// --- Configuração do Multer para Upload de Imagens ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});
exports.upload = multer({ storage });

exports.listProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
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
      where: { id: productId }
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
  const { name, description, price } = req.body;
  const image = req.file ? req.file.path : null; 

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        admin: { connect: { id: req.user.userId } }, 
      }
    });
    res.status(201).json(product);
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id, 10);
  const { name, description, price, image } = req.body;
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'ID de produto inválido.' });
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { name, description, price: parseFloat(price), image }
    });
    res.json(product);
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