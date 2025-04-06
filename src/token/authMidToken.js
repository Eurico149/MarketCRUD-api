import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    const token = authHeader.split(' ')[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_key');
        next();
    } catch (err) {
        return res.status(403).json({message: 'Token invalido'});
    }
};

export default authMiddleware;
