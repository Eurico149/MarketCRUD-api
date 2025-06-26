import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({message: 'Token nao fornecido'});
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_key');
        next();
    } catch (err) {
        res.status(403).json({message: 'Token invalido'});
    }
};

export default authMiddleware;
