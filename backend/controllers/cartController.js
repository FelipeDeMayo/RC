const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.viewCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.userId },
      include: { items: { include: { product: true } } }
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar carrinho' });
  }
};

exports.addItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
      return res.json(updatedItem);
    } else {
      const newItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      });
      return res.status(201).json(newItem);
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' });
  }
};

exports.removeItem = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.userId } });
    if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId: parseInt(productId) }
    });

    res.json({ message: 'Item removido do carrinho' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover item do carrinho' });
  }
};
