const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1]; // JWT Token are usually saved as 'Bearer <token'>
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // store user info in request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid JWT token, Unauthorized' });
    }
};

module.exports = authMiddleware;
