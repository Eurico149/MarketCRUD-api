import mongoose from 'mongoose';

const Mercadoria = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

Mercadoria.index({nome: 1, usuario: 1}, {unique: true});

export default mongoose.model('Mercadoria', Mercadoria);
