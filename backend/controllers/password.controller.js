const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passwordService = require('../services/password.service');
const emailService = require('../services/email.service');
const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { email: req.body.email } });
        if (!user) {
            return res.json({ message: 'Se um utilizador com esse e-mail existir, um link de redefinição será enviado.' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
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

exports.resetPassword = async (req, res) => {
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
