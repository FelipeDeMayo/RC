const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshTokenHandler);
router.post('/logout', authController.logout);
router.post('/2fa/login', authController.loginWithTwoFactor);
router.post('/2fa/generate', verifyToken, authController.generateTwoFactorSecret);
router.post('/2fa/verify', verifyToken, authController.verifyTwoFactor);

module.exports = router;