import express from 'express';
import bcrypt from 'bcrypt';
import User from './../models/user.js';
import {generateRefreshToken, generateAccessToken, validateRefreshToken} from './../token/tokenService.js';
import authMiddleware from "../token/authMidToken.js";


const router = express.Router();
router.use(express.json());

router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if (user) {
            return res.status(400).json({message: 'Username ja em Uso'});
        }

        const hashSenha = await bcrypt.hashSync(password, 10);
        const newUser = new User({username, password: hashSenha});

        await newUser.save();
        return res.status(201).json({message: 'Usuario Criado com Sucesso'});
    } catch (error) {
        console.error('Erro ao registrar usuario:', error);
        return res.status(400).json({message: 'Error ao Registrar Usuario'});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({message: 'Usuario ou Senha Invalido'});
        }

        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            return res.status(400).json({message: 'Usuario ou Senha Invalido'});
        }

        const accessToken = generateAccessToken({id: user.id, username: user.username});
        const refreshToken = generateRefreshToken({id: user.id});

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 24 * 60 * 60 * 1000
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 10 * 60 * 1000
        })

        res.status(200).json({message: 'Usuario Logado'})
    } catch (error) {
        console.error('Erro ao logar usuario:', error);
        res.status(500)
    }
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
        console.error('Erro ao refresh token:', error);
        return res.status(400).json({message: 'Token Invalido'});
    }
});

router.post('/logout', authMiddleware, async (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logout realizado com sucesso' });
})

export default router;