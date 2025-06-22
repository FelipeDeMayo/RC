const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer =  require('multer');
const path = require('path'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto por ID' });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body
  const image = req.file ? req.file.filename : null

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' })
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
    })
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto' })
  }
}


exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price: parseFloat(price), image }
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};
