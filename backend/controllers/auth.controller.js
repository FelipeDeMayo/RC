const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passwordService = require('../services/password.service');
const tokenService = require('../services/token.service');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
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

exports.login = async (req, res) => {
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

exports.refreshTokenHandler = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ error: "Refresh token ausente" });
    }
    try {
        const dbRefreshToken = await prisma.refreshToken.findFirst({ where: { token } });
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

exports.logout = async (req, res) => {
  const { token } = req.body;
  try {
    if (token) {
        await prisma.refreshToken.deleteMany({ where: { token } });
    }
    res.status(204).send('Logout bem-sucedido.');
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer logout.' });
  }
};
