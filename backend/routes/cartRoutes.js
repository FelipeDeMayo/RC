const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.get('/', verifyToken, cartController.getCartItems)
router.post('/', verifyToken, cartController.addItem)
router.delete('/:productId', verifyToken, cartController.removeItem)
router.delete('/', verifyToken, cartController.clearCart);

module.exports = router
