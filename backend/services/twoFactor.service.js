const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passwordService = require('../services/password.service');
const tokenService = require('../services/token.service');
const twoFactorService = require('../services/twoFactor.service');
const emailService = require('../services/email.service');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'A senha não atende aos requisitos de segurança.' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso.' });
    }
    const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const userRole = adminExists ? 'CLIENT' : 'ADMIN';
    const hashedPassword = await passwordService.hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: userRole },
    });
    res.status(201).json({ message: `Utilizador ${user.email} criado com a permissão: ${user.role}` });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registar utilizador.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const isMatch = await passwordService.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    if (user.isTwoFactorEnabled) {
      return res.json({ twoFactorRequired: true, userId: user.id });
    }
    const { accessToken, refreshToken } = await tokenService.generateTokens(user);
    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isTwoFactorEnabled: user.isTwoFactorEnabled },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
  }
};

const loginWithTwoFactor = async (req, res) => {
    const { userId, token } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) {
            return res.status(401).json({ error: 'Utilizador ou segredo 2FA não encontrado.' });
        }
        const isValid = twoFactorService.verifyToken(token, user.twoFactorSecret);
        if (!isValid) {
            return res.status(401).json({ error: 'Código 2FA inválido.' });
        }
        const { accessToken, refreshToken } = await tokenService.generateTokens(user);
        res.json({
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, isTwoFactorEnabled: user.isTwoFactorEnabled },
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar código 2FA.' });
    }
};

const generateTwoFactorSecret = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'Utilizador não encontrado.' });
        }
        const secret = twoFactorService.generateSecret();
        const otpauth = twoFactorService.generateOtpAuthUrl(user.email, secret);
        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret, isTwoFactorEnabled: false },
        });
        res.json({ secret, otpauth });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar segredo 2FA.' });
    }
};

const verifyTwoFactor = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { token } = req.body;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) {
            return res.status(400).json({ error: 'O setup do 2FA não foi iniciado corretamente.' });
        }
        const isValid = twoFactorService.verifyToken(token, user.twoFactorSecret);
        if (!isValid) {
            return res.status(400).json({ error: 'Código de verificação inválido.' });
        }
        await prisma.user.update({
            where: { id: userId },
            data: { isTwoFactorEnabled: true },
        });
        res.json({ message: 'Autenticação de dois fatores habilitada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar código 2FA.' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { email: req.body.email } });
        if (!user) {
            return res.json({ message: 'Se um utilizador com esse e-mail existir, um link de redefinição será enviado.' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
        await prisma.user.update({
            where: { email: user.email },
            data: { passwordResetToken, passwordResetExpires },
        });
        await emailService.sendPasswordResetEmail(user.email, resetToken);
        res.json({ message: 'Se um utilizador com esse e-mail existir, um link de redefinição será enviado.' });
    } catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao processar o seu pedido.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: { gt: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json({ error: 'Token inválido ou expirado.' });
        }
        const { password } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'A nova senha não atende aos requisitos de segurança.' });
        }
        const hashedPassword = await passwordService.hashPassword(password);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
        res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao redefinir a sua senha.' });
    }
};

const refreshTokenHandler = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ error: "Refresh token ausente" });
    }
    try {
        const dbRefreshToken = await prisma.refreshToken.findFirst({
            where: { token: token }
        });

        if (!dbRefreshToken || new Date() > dbRefreshToken.expiresIn) {
            return res.status(403).json({ error: "Refresh token inválido ou expirado" });
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ error: "Falha na verificação do refresh token" });
            
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user) return res.status(403).json({ error: "Utilizador não encontrado" });

            const newAccessToken = tokenService.generateAccessToken(user);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar token" });
    }
};

const logout = async (req, res) => {
  const { token } = req.body;
  try {
    if (token) {
        await prisma.refreshToken.deleteMany({
            where: { token: token },
        });
    }
    res.status(204).send('Logout bem-sucedido.');
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ error: 'Erro ao fazer logout.' });
  }
};

module.exports = {
  register,
  login,
  loginWithTwoFactor,
  generateTwoFactorSecret,
  verifyTwoFactor,
  forgotPassword,
  resetPassword,
  refreshTokenHandler,
  logout,
};
