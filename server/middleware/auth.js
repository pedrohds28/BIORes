const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const tolken = req.header('x-auth-token');

    if (!tolken) { return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' }); }

    try {
        const decoded = jwt.verify(tolken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};