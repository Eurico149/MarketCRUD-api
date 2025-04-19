import authMiddleware from './../token/authMidToken.js';
import express from "express";
import User from "./../models/user.js";
import Mercadoria from "../models/mercadoria.js";


async function validateUser(id, username){
    return User.findOne({_id: id, username});
}

async function validateMercadoria(idUser, idMerch){
    return Mercadoria.findOne({_id: idMerch, usuario: idUser});
}

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await validateUser(id, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
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
        return res.status(201).json(mercadoria);
    } catch (error) {
        return res.status(401).json({message: 'Erro ao criar mercadoria'});
    }
});

router.post("/list", authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await validateUser(id, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
        }

        const mercadorias = req.body;
        if (!Array.isArray(mercadorias)) {
            return res.status(401).json({message: 'Mercadorias invalida'});
        }

        mercadorias.forEach((mercadoria) => {
            mercadoria.usuario = user._id;
        });

        const resultado = await Mercadoria.insertMany(mercadorias);

        user.mercadorias.push(...resultado.map((m) => m._id));
        await user.save()
        res.status(201).json(resultado);

    } catch (error) {
        return res.status(401).json({message: 'Erro ao criar mercadoria'});
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await validateUser(id, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
        }

        const idmerch = req.params.id;
        const mercadoria = await validateMercadoria(id, idmerch);
        if (!mercadoria){
            return res.status(401).json({message: 'Mercadoria nao existe'});
        }

        await user.updateOne({ $pull: { mercadorias: mercadoria._id } });
        await mercadoria.deleteOne();
        return res.status(200).json({message: 'Mercadoria deletada'});
    } catch (error) {
        res.status(401).json({message: 'Erro ao deletar mercadoria'});
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    const {id: idUser, username} = req.user;

    try {
        const user = await validateUser(idUser, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
        }

        const id = req.params.id;
        const mercadoria = await validateMercadoria(idUser, id);
        if (!mercadoria){
            return res.status(401).json({message: 'Mercadoria nao existe'})
        }

        const {nome, valor, descricao} = req.body;
        mercadoria.nome = nome;
        mercadoria.valor = valor;
        mercadoria.descricao = descricao;
        await mercadoria.save()
        res.status(200).json({mercadoria});

    } catch (error){
        return res.status(401).json({message: 'Erro ao modificar mercadoria'});
    }
});

router.get('/', authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await validateUser(id, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
        }

        const mercadorias = await Mercadoria.find({usuario: id});

        return res.status(200).json(mercadorias);
    } catch (error) {
        return res.status(401).json({message: 'Erro ao pegar mercadoria'});
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    const {id: userId, username} = req.user;
    const {id} = req.params;

    try {
        const user = await validateUser(userId, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
        }

        const mercadoria = await validateMercadoria(userId, id);

        if (!mercadoria){
            return res.status(401).json({message: 'Mercadoria nao existe'});
        }

        return res.status(200).json(mercadoria);
    } catch (error){
        res.status(401).json({message: 'Erro ao enviar mercadoria'});
    }
});

export default router;