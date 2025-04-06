import authMiddleware from './../token/authMidToken.js';
import express from "express";
import mongoose from "mongoose";
import User from "./../models/user.js";
import Mercadoria from "../models/mercadoria.js";


const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(401).json({message: 'Usuario nao existe'});
        }
        if (user.username !== username) {
            return res.status(401).json('Usuario nao existe');
        }

        const {nome, valor, descricao} = req.body;
        const mercadoria = new Mercadoria({
            nome,
            valor,
            descricao,
            usuario: user.id
        });
        await mercadoria.save();

        user.mercadorias.push(mercadoria);
        await user.save()
        return res.status(201).json({mercadoria});
    } catch (error) {
        return res.status(401).json({message: 'Erro ao criar o mercadoria'});
    }
});

router.get('/', authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(401).json({message: 'Usuario nao existe'});
        }
        if (user.username !== username) {
            return res.status(401).json({message: 'Usuario nao existe'});
        }

        const mercadorias = await Mercadoria.find({usuario: id});

        return res.status(200).json({mercadorias});
    } catch (error) {
        return res.status(401).json({message: 'Erro ao pegar mercadoria'});
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    const {id: userId, username} = req.user;
    const {id} = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({message: 'Usuario nao existe'});
        }
        if (user.username !== username) {
            return res.status(401).json({message: 'Usuario nao existe'});
        }

        const mercadoria = await Mercadoria.findById(id);
        if (!mercadoria) {
            return res.status(401).json({message: 'Mercadoria nao existe'});
        }
        if (mercadoria.usuario.toString() !== userId) {
            return res.status(401).json({message: 'Mercadoria nao existe'});
        }

        return res.status(200).json({mercadoria});
    } catch (error){
        res.status(401).json({message: 'Erro ao enviar mercadoria'});
    }
})

export default router;