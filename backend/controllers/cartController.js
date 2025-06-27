const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCartItems = async (req, res) => {
  const userId = req.user.userId;
  console.log(`--- BACKEND: Buscando carrinho para o usuário ${userId}`);

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      console.log(`--- BACKEND: Carrinho não encontrado ou vazio. Enviando 0 itens.`);
      return res.json({ items: [], totalItems: 0, totalPrice: 0 });
    }

    const items = cart.items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);

    const totalItems = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    console.log(`--- BACKEND: Enviando ${items.length} tipos de itens (total ${totalItems} unidades).`);
    res.json({
      items,
      totalPrice,
      totalItems,
    });
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    res.status(500).json({ error: "Erro ao buscar carrinho" });
  }
};

exports.addItem = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;
  console.log(`--- BACKEND: Adicionando item ${productId} para o usuário ${userId}`);

  try {
    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    let item;
    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      item = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }
    res.status(201).json(item);
  } catch (err) {
    console.error("Erro ao adicionar item:", err);
    res.status(500).json({ error: "Erro ao adicionar item ao carrinho" });
  }
};

// Arquivo: backend/controllers/cartController.js

exports.removeItem = async (req, res) => {
  const userId = req.user.userId;
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Procura o item específico no carrinho
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    // Se o item não existir no carrinho, não faz nada
    if (!existingItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // --- A NOVA LÓGICA QUE VOCÊ QUER ---
    // Se a quantidade for maior que 1, apenas diminui
    if (existingItem.quantity > 1) {
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity - 1,
        },
      });
    } else {
      // Se a quantidade for 1, apaga o item do carrinho
      await prisma.cartItem.delete({
        where: {
          id: existingItem.id,
        },
      });
    }

    res.json({ message: "Item quantity updated successfully" });

  } catch (err) {
    console.error("Error updating item quantity:", err);
    res.status(500).json({ error: "Error updating item quantity" });
  }
};

exports.clearCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ message: "Carrinho limpo com sucesso" });
  } catch (err) {
    console.error("Erro ao limpar o carrinho:", err);
    res.status(500).json({ error: "Erro ao limpar o carrinho" });
  }
};