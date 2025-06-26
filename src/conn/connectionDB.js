import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017';

const connDB = async () => {
    try{
        await mongoose.connect(mongoURI, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            authSource: process.env.AUTH_SOURCE || 'admin'
        })
        console.log('Mongo Conectado');
    } catch (erro){
        console.error('Erro ao conectar ao MongoDB:', erro);
    }
};

export default connDB;
