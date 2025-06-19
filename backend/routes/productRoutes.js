const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');


router.get('/products', listProducts);

router.post('/products', verifyToken, isAdmin, upload.single('image'), createProduct);
router.put('/products/:id', verifyToken, isAdmin, updateProduct);
router.delete('/products/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
