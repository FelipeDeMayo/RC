const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const twoFactorController = require('../controllers/twoFactor.controller');
const passwordController = require('../controllers/password.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshTokenHandler);
router.post('/logout', authController.logout);

router.post('/2fa/login', twoFactorController.loginWithTwoFactor);
router.post('/2fa/generate', verifyToken, twoFactorController.generateTwoFactorSecret);
router.post('/2fa/verify', verifyToken, twoFactorController.verifyTwoFactor);

router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password/:token', passwordController.resetPassword);

module.exports = router;