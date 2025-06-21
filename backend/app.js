const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const { verifyToken, isAdmin } = require('./middlewares/authMiddleware');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);              
app.use('/api', verifyToken, productRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

module.exports = app;
