const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretoforte';

// 1. Define a função verifyToken como uma constante (sem exports. antes)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Injeta os dados do usuário na requisição
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token de acesso expirado.' });
        }
        console.error('[VERIFY] Erro na validação do token:', error.message);
        return res.status(401).json({ error: 'Token inválido ou corrompido.' });
    }
};

// 2. Define a função isAdmin como uma constante (sem exports. antes)
const isAdmin = (req, res, next) => {
    // É importante garantir que req.user exista antes de acessar .role
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Apenas administradores têm acesso.' });
    }
    next();
};

// 3. Exporta ambas as funções usando module.exports
module.exports = { verifyToken, isAdmin };