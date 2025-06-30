const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, cartController.getCartItems);
router.post('/', verifyToken, cartController.addItem);
router.delete('/clear', verifyToken, cartController.clearCart); // Rota para limpar o carrinho
router.delete('/:productId', verifyToken, cartController.removeItem); // Rota para remover um item

module.exports = router;