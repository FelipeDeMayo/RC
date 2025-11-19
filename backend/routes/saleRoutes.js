const express = require('express');
const router = express.Router();

// Caminho corrigido para controllers/saleController
const saleController = require('../controllers/saleController'); 

// Importa as funções de middleware
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware'); 

// Rota POST de Checkout (requer autenticação)
router.post('/checkout', verifyToken, saleController.registerSale);

// Rota GET Histórico de Cliente (requer autenticação)
router.get('/history', verifyToken, saleController.getCustomerSales);

// Rota GET Relatório Admin (requer autenticação e permissão ADMIN)
router.get('/admin/sales', verifyToken, isAdmin, saleController.getAllSales);

module.exports = router;