const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const csv = require('csv-parser');
const cloudinary = require('../config/cloudinary'); // 1. Importa a configuração do Cloudinary

// A configuração do Multer para salvar localmente foi REMOVIDA daqui.

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

// 2. Lógica de createProduct ATUALIZADA
exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  try {
    let imageUrl = ''; // Inicia a URL da imagem como vazia

    // Se um arquivo foi enviado, faz o upload para o Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'produtos_ecommerce',
      });
      imageUrl = result.secure_url; // Pega a URL segura retornada
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: imageUrl, // Salva a URL do Cloudinary (ou uma string vazia)
        admin: { connect: { id: req.user.userId } },
      },
    });
    res.status(201).json(product);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// 3. Lógica de updateProduct ATUALIZADA
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id, 10);
  const { name, description, price } = req.body;

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'ID de produto inválido.' });
  }

  try {
    // Busca o produto existente para saber a URL da imagem atual
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado.'});
    }

    let imageUrl = existingProduct.image; // Mantém a imagem antiga por padrão

    // Se um NOVO arquivo foi enviado, substitui a imagem
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'produtos_ecommerce',
      });
      imageUrl = result.secure_url;
      // Opcional: deletar a imagem antiga do Cloudinary para economizar espaço
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: parseFloat(price),
        image: imageUrl, // Atualiza com a nova URL (ou a antiga, se não houver novo upload)
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


// A lógica de bulkImport não precisa de alterações
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
      if (row.name && row.description && !isNaN(price)) {
        products.push({
          name: row.name,
          description: row.description,
          price: price,
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
            'Arquivo CSV vazio ou mal formatado. Colunas necessárias: name, description, price. Opcional: image (com a URL).',
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