const express = require('express');
const authController = require('../controllers/authController');
const JWT_SECRET = process.env.JWT_SECRET || 'secretoforte';

 
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshTokenHandler);
router.post('/logout', authController.logout);

module.exports = router;
