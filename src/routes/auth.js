import express from 'express';
import bcrypt from 'bcrypt';
import User from './../models/user.js';
import {generateRefreshToken, generateAccessToken, validateRefreshToken} from './../token/tokenService.js';


const router = express.Router();
router.use(express.json());

router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if (user) {
            return res.status(400).json({message: 'username ja esta em uso'});
        }

        const hashSenha = await bcrypt.hashSync(password, 12);
        const newUser = new User({username, password: hashSenha});

        await newUser.save();
        return res.status(201).json({message: 'usuario criado com sucesso'});
    } catch (error) {
        return res.status(400).json({message: 'Error ao registrar usuario'});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if (!user){
        return res.status(400).json({message: 'Usuario ou Senha Invalido'});
    }

    const pass = await bcrypt.compare(password, user.password);
    if (!pass){
        return res.status(400).json({message: 'Usuario ou Senha Invalido'});
    }

    const accessToken = generateAccessToken({id: user.id, username: user.username});
    const refreshToken = generateRefreshToken({id: user.id});

    res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json({accessToken});
});

router.post('/refresh', async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({message: 'Token nao fronecido'});
        }

        const decoded = validateRefreshToken(token);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({message: 'Token Invalido'});
        }

        const accessToken = generateAccessToken({id: user.id, username: user.username});
        return res.status(201).json({accessToken});
    } catch (error) {
        return res.status(400).json({message: 'Token Invalido'});
    }
});

export default router;