const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

async function createSaleTransaction(customerId, cartItems) {
    
    return prisma.$transaction(async (tx) => {
        let totalAmount = 0;
        const itemDetails = [];

        // 1. Validação, cálculo de total e decremento de estoque
        for (const item of cartItems) {
            const product = await tx.product.findUnique({
                where: { id: item.productId },
                select: { id: true, price: true, stock: true }
            });

            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found.`);
            }
            // NOTA: Para esta linha funcionar, sua model Product no schema.prisma deve ter um campo 'stock: Int'.
            if (product.stock === undefined || product.stock < item.quantity) {
                 throw new Error(`Insufficient stock for product ID ${item.productId}. Available: ${product.stock}`);
            }

            const itemTotalPrice = product.price * item.quantity;
            totalAmount += itemTotalPrice;

            itemDetails.push({
                productId: product.id,
                quantity: item.quantity,
                unitPriceAtSale: product.price,
            });

            // Decrementa estoque
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    }
                }
            });
        }

        // 2. Cria o registro de Venda
        const sale = await tx.sale.create({
            data: {
                customerId: customerId,
                totalAmount: totalAmount,
                status: 'COMPLETED',
            }
        });

        // 3. Cria os itens da Venda
        await tx.saleItem.createMany({
            data: itemDetails.map(detail => ({
                saleId: sale.id,
                productId: detail.productId,
                quantity: detail.quantity,
                unitPriceAtSale: detail.unitPriceAtSale,
            }))
        });

        // 4. Limpa o carrinho
        const cart = await tx.cart.findUnique({ where: { userId: customerId } });
        if (cart) {
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        return sale.id;
    });
}

exports.registerSale = async (req, res) => {
    const userId = req.user.userId;

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { 
                items: { 
                    include: { product: true } 
                } 
            },
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "O carrinho está vazio." });
        }

        const saleItemsData = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
        }));

        // Chama a transação
        const newSaleId = await createSaleTransaction(userId, saleItemsData); 

        res.status(201).json({ 
            message: "Venda registrada e carrinho limpo com sucesso!", 
            saleId: newSaleId 
        });
        
    } catch (error) {
        // Erro 400 para erros de negócio (estoque), 500 para erros internos
        const statusCode = error.message.includes('stock') || error.message.includes('vazio') ? 400 : 500;
        res.status(statusCode).json({ error: error.message || "Falha na transação de checkout." });
    }
};

exports.getCustomerSales = async (req, res) => {
    const customerId = req.user.userId;

    try {
        const salesHistory = await prisma.sale.findMany({
            where: { customerId: customerId },
            orderBy: { saleDate: 'desc' },
            include: {
                saleItems: {
                    include: {
                        product: {
                            select: { name: true, image: true }
                        }
                    }
                }
            }
        });

        res.json(salesHistory);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sales history." });
    }
};

exports.getAllSales = async (req, res) => {
    if (req.user.role !== Role.ADMIN) {
        // Este check já está no middleware, mas mantemos como backup
        return res.status(403).json({ error: "Access denied. Requires Admin role." });
    }

    try {
        const allSales = await prisma.sale.findMany({
            orderBy: { saleDate: 'desc' },
            include: {
                customer: {
                    select: { id: true, name: true, email: true }
                },
                saleItems: {
                    include: {
                        product: {
                            select: { name: true, price: true }
                        }
                    }
                }
            }
        });

        res.json(allSales);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch all sales records." });
    }
};