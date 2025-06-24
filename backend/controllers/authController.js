const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'secretoforte';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refreshsupersecreto';

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso.' });
    }

    const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (role === 'ADMIN' && adminExists) {
      return res.status(403).json({ error: 'Não é permitido criar conta de administrador.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'CLIENT',
      },
    });

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Credenciais inválidas.' });
    
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } 
    );

    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date(Date.now() + sevenDaysInMs);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresIn: expiryDate,
      },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};

const refreshTokenHandler = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Refresh token ausente' });
  }

  try {
    const dbRefreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!dbRefreshToken) {
      return res.status(403).json({ error: 'Refresh token inválido ou revogado.' });
    }

    if (new Date() > dbRefreshToken.expiresIn) {
      await prisma.refreshToken.delete({ where: { token } });
      return res.status(403).json({ error: 'Sessão expirada. Por favor, faça login novamente.' });
    }

    jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Falha na verificação do refresh token.' });
      }

      const newAccessToken = jwt.sign(
        { userId: user.userId, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken: newAccessToken });
    });

  } catch (error) {
    console.error('Erro ao atualizar token:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar token.' });
  }
};

const logout = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(204); 
  }

  try {
    await prisma.refreshToken.deleteMany({
      where: {
        token: token,
      },
    });
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
  logout
};