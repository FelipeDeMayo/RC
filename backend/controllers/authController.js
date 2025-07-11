const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticator } = require('otplib');

const JWT_SECRET = process.env.JWT_SECRET || 'secretoforte';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refreshsupersecreto';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // --- INÍCIO DA VALIDAÇÃO DE SENHA FORTE ---
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'A senha não atende aos requisitos: mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.' 
      });
    }
    // --- FIM DA VALIDAÇÃO ---

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso.' });
    }

    const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const userRole = adminExists ? 'CLIENT' : 'ADMIN';

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: userRole },
    });
    
    console.log(`Usuário ${user.email} criado com a permissão: ${user.role}`);
    res.status(201).json({ message: 'Usuário criado com sucesso.' });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (user.isTwoFactorEnabled) {
      return res.json({
        twoFactorRequired: true,
        userId: user.id,
      });
    }

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: { token: refreshToken, expiresIn: expiryDate },
      create: { token: refreshToken, userId: user.id, expiresIn: expiryDate },
    });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isTwoFactorEnabled: user.isTwoFactorEnabled },
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
  }
};

const loginWithTwoFactor = async (req, res) => {
  const { userId, token } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      return res.status(401).json({ error: 'Usuário ou segredo 2FA não encontrado.' });
    }
    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!isValid) {
      return res.status(401).json({ error: 'Código 2FA inválido.' });
    }
    const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: { token: refreshToken, expiresIn: expiryDate },
      create: { token: refreshToken, userId: user.id, expiresIn: expiryDate },
    });
    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isTwoFactorEnabled: user.isTwoFactorEnabled },
    });
  } catch (error) {
    console.error("Erro no login com 2FA:", error);
    res.status(500).json({ error: 'Erro ao verificar código 2FA.' });
  }
};

const generateTwoFactorSecret = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'RC Fitness', secret);
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret, isTwoFactorEnabled: false },
    });
    res.json({ secret, otpauth });
  } catch (error) {
    console.error("Erro ao gerar segredo 2FA:", error);
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
    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!isValid) {
      return res.status(400).json({ error: 'Código de verificação inválido. Tente novamente.' });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });
    res.json({ message: 'Autenticação de dois fatores habilitada com sucesso!' });
  } catch (error) {
    console.error("Erro ao verificar o código 2FA:", error);
    res.status(500).json({ error: 'Erro ao verificar código 2FA.' });
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
        jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: "Falha na verificação do refresh token" });
            const newAccessToken = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
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
  refreshTokenHandler,
  logout,
  loginWithTwoFactor,
  generateTwoFactorSecret,
  verifyTwoFactor,
};
