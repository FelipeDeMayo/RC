const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

router.get('/cart', verifyToken, cartController.viewCart);
router.post('/cart', verifyToken, cartController.addItem);
router.delete('/cart/:productId', verifyToken, cartController.removeItem);

module.exports = router;
