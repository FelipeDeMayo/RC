const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const upload = multer({ dest: 'tmp/' });

router.get('/products', productController.listProducts);
router.get('/products/:id', productController.getProductById);

router.post(
  '/products',
  verifyToken,
  isAdmin,
  upload.single('image'),
  productController.createProduct
);

router.put(
  '/products/:id',
  verifyToken,
  isAdmin,
  upload.single('image'), 
  productController.updateProduct
);

router.delete(
  '/products/:id',
  verifyToken,
  isAdmin,
  productController.deleteProduct
);

router.post(
  '/products/bulk-import',
  verifyToken,
  isAdmin,
  upload.single('file'),
  productController.bulkImportProducts
);

module.exports = router;