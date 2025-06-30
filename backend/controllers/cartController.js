const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// BUSCAR O CARRINHO
exports.getCartItems = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { productId: 'asc' }, // Ordena para consistência
          include: { product: true },
        },
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.json({ items: [], totalItems: 0, totalPrice: 0 });
    }

    const items = cart.items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const totalPrice = items.reduce((total, item) => total + item.quantity * item.price, 0);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    res.json({ items, totalPrice, totalItems });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar carrinho" });
  }
};

// ADICIONAR ITEM
exports.addItem = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;
  try {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      res.status(200).json(updatedItem);
    } else {
      const newItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
      res.status(201).json(newItem);
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar item ao carrinho" });
  }
};

// REMOVER UMA UNIDADE DO ITEM (A LÓGICA QUE VOCÊ QUERIA)
exports.removeItem = async (req, res) => {
  const userId = req.user.userId;
  const productId = parseInt(req.params.productId, 10);
  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: productId },
    });
    if (!existingItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }
    if (existingItem.quantity > 1) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity - 1 },
      });
      res.json(updatedItem);
    } else {
      await prisma.cartItem.delete({ where: { id: existingItem.id } });
      res.json({ message: "Item completely removed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating item quantity" });
  }
};

// LIMPAR O CARRINHO INTEIRO
exports.clearCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ message: "Carrinho limpo com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao limpar o carrinho" });
  }
};