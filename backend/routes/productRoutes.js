const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAdmin } = require('../middlewares/authMiddleware');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });

router.get('/products', productController.listProducts);
router.get('/products/:id', productController.getProductById);

router.post('/products', isAdmin, upload.single('image'), productController.createProduct);
router.put('/products/:id', isAdmin, upload.single('image'), productController.updateProduct);
router.delete('/products/:id', isAdmin, productController.deleteProduct);

module.exports = router;
