const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

router.get('/', verifyToken, cartController.viewCart);
router.post('/', verifyToken, cartController.addItem);
router.delete('/:productId', verifyToken, cartController.removeItem);

module.exports = router;
