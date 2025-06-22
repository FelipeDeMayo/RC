const cors = require('cors');
const multer = require('multer');
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const productController = require('./controllers/productController')
const authMiddleware = require('./middlewares/authMiddleware') 


const { verifyToken, isAdmin } = require('./middlewares/authMiddleware');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}${ext}`
    cb(null, filename)
  }
})

const upload = multer({ storage })

app.use('/auth', authRoutes);              
app.use('/api', verifyToken, productRoutes);
app.get('/', (req, res) => {
  res.send('API funcionando!');
});
app.use('/cart', cartRoutes);

module.exports = app;
