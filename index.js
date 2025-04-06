import express from 'express';
import dotenv from 'dotenv';
import conn from './src/conn/connection.js';
import auth from './src/routes/auth.js';
import cookieParser from 'cookie-parser';


dotenv.config();
conn();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/auth', auth);

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'http://localhost';


app.get('/', (req, res) => {
    res.json({'message': 'opa'})
})

app.listen(PORT, () => {
    console.log(`${URL}:${PORT}`);
})
