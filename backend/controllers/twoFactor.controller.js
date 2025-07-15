const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const tokenService = require('../services/token.service');
const twoFactorService = require('../services/twoFactor.service');

exports.generateTwoFactorSecret = async (req, res) => {
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

exports.verifyTwoFactor = async (req, res) => {
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

exports.loginWithTwoFactor = async (req, res) => {
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