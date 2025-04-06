import express from 'express';
import dotenv from 'dotenv';
import conn from './src/conn/connection.js';

conn();
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'http://localhost';


app.get('/', (req, res) => {
    res.json({'message': 'opa'})
})

app.listen(process.env.PORT, () => {
    console.log(`${URL}:${PORT}`);
})
