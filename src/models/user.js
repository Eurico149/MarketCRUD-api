import mongoose from 'mongoose'

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mercadorias: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mercadoria'
    }]
});

export default mongoose.model('User', user)
