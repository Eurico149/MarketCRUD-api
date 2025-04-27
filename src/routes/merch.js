import authMiddleware from './../token/authMidToken.js';
import express from "express";
import User from "./../models/user.js";
import Mercadoria from "../models/mercadoria.js";
import redis from "../conn/connectionCache.js";


async function getUser(_id, username){
    let user;

    try {
        user = await redis.get(`user:${_id};${username}`);
        if (user){
            user = JSON.parse(user);
            user = User.hydrate(user);
            console.log(`\nREDIS HIT USER -> ${_id}, ${username}\n`)
        }
    } catch (err) {
        console.log(`\nERROR REDIS USER - ${err}\n`);
    }

    if (!user){
        console.log(`\nREDIS MISS USER -> ${_id}, ${username}\n`)
        try {
            user = await User.findOne({_id, username});
            if (user)
                redis.set(`user:${_id};${username}`, JSON.stringify(user.toObject()));
        } catch (err) {
            console.error(`\nMONGODB MISS USER -> ${_id},${username}\n`);
        }
    }

    return user;
}

async function getMercadoria(idMerch, idUser){
    let merch;

    try {
        merch = await redis.get(`merch:${idMerch};${idUser}`);
        if (merch){
            merch = JSON.parse(merch);
            merch = Mercadoria.hydrate(merch);
            console.log(`\nREDIS HIT MERCH -> ${idMerch}, ${idUser}\n`)
        }
    } catch (err) {
        console.error(`\nERROR REDIS MERCH - ${err}\n`);
    }

    if (!merch) {
        console.log(`\nREDIS MISS MERCH -> ${idMerch}, ${idUser}\n`)
        try {
            merch = await Mercadoria.findOne({_id: idMerch, usuario: idUser});
            if (merch)
                redis.set(`merch:${idMerch};${idUser}`, JSON.stringify(merch.toObject()));
        } catch (err) {
            console.error(`\nMONGODB MISS MERCH -> ${idMerch},${idUser}\n`, err);
        }
    }

    return merch;
}

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await getUser(id, username);
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
        res.status(201).json(mercadoria);
    } catch (error) {
        res.status(401).json({message: 'Erro ao criar mercadoria'});
    }
});

router.post("/list", authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await getUser(id, username);
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
        res.status(401).json({message: 'Erro ao criar mercadoria'});
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await getUser(id, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
        }

        const idMerch = req.params.id;
        const mercadoria = await getMercadoria(idMerch, id);
        if (!mercadoria){
            return res.status(401).json({message: 'Mercadoria nao existe'});
        }

        await user.updateOne({ $pull: { mercadorias: mercadoria._id } });
        await mercadoria.deleteOne();

        try {
            redis.del(`merch:${idMerch};${id}`);
            redis.set(`user:${id};${username}`, JSON.stringify(user.toObject()));
        } catch {
            console.error(`\nERROR REDIS DELETE MERCH - ${idMerch}, ${id}\n`)
        }

        res.status(200).json({message: 'Mercadoria deletada'});
    } catch (error) {
        res.status(401).json({message: 'Erro ao deletar mercadoria'});
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    const {id: idUser, username} = req.user;

    try {
        const user = await getUser(idUser, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
        }

        const id = req.params.id;
        const mercadoria = await getMercadoria(id, idUser);
        if (!mercadoria){
            return res.status(401).json({message: 'Mercadoria nao existe'})
        }

        const {nome, valor, descricao} = req.body;
        mercadoria.nome = nome;
        mercadoria.valor = valor;
        mercadoria.descricao = descricao;
        await mercadoria.save()

        try {
            redis.set(`merch:${id};${idUser}`, JSON.stringify(mercadoria.toObject()));
        } catch (error) {
            console.error(`\nERROR REDIS UPDATE MERCH - ${id}, ${idUser}\n`)
        }

        res.status(200).json({mercadoria});
    } catch (error){
        res.status(401).json({message: 'Erro ao modificar mercadoria'});
    }
});

router.get('/', authMiddleware, async (req, res) => {
    const {id, username} = req.user;

    try {
        const user = await getUser(id, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
        }

        const mercadorias = await Mercadoria.find({usuario: id});

        res.status(200).json(mercadorias);
    } catch (error) {
        res.status(401).json({message: 'Erro ao pegar mercadoria'});
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    const {id: userId, username} = req.user;
    const {id} = req.params;

    try {
        const user = await getUser(userId, username);
        if (!user){
            return res.status(401).json({message: 'Usuario nao existe'})
        }

        const mercadoria = await getMercadoria(id, userId);

        if (!mercadoria){
            return res.status(401).json({message: 'Mercadoria nao existe'});
        }

        res.status(200).json(mercadoria);
    } catch (error){
        res.status(401).json({message: 'Erro ao enviar mercadoria'});
    }
});

export default router;