const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getCartItems = async (req, res) => {
  const userId = req.user.userId

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    })

    if (!cart) return res.json([])

    const mappedItems = cart.items.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image 
    }))

    res.json(mappedItems)
  } catch (err) {
    console.error('Erro ao buscar carrinho:', err)
    res.status(500).json({ error: 'Erro ao buscar carrinho' })
  }
}


exports.addItem = async (req, res) => {
  const userId = req.user.userId
  const { productId, quantity } = req.body

  try {
    let cart = await prisma.cart.findUnique({ where: { userId } })

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } })
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    })

    let item
    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      item = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      })
    }

    res.status(201).json(item)
  } catch (err) {
    console.error('Erro ao adicionar item:', err)
    res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' })
  }
}

exports.removeItem = async (req, res) => {
  const userId = req.user.userId
  const productId = parseInt(req.params.productId)

  try {
    const cart = await prisma.cart.findUnique({ where: { userId } })
    if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' })

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId }
    })

    res.json({ message: 'Item removido do carrinho' })
  } catch (err) {
    console.error('Erro ao remover item:', err)
    res.status(500).json({ error: 'Erro ao remover item do carrinho' })
  }
}
