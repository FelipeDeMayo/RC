const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.upsert({
    where: { userId: user.id },
    update: { token: refreshToken, expiresIn: expiryDate },
    create: { token: refreshToken, userId: user.id, expiresIn: expiryDate },
  });

  return refreshToken;
};

const generateTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);
  return { accessToken, refreshToken };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
