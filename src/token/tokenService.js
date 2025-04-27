import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_key';

export function generateAccessToken(payload){
    return jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: '10m'});
}

export function generateRefreshToken(payload){
    return jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '15d'});
}

export function validateRefreshToken(token){
    return jwt.verify(token, JWT_REFRESH_SECRET);
}
