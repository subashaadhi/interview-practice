import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js'

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req,res) => {
    res.json({message: 'int-practice api works'})
})



app.listen(process.env.PORT || 5000 , ()=> {
    console.log(`Server running on Port ${process.env.PORT }`)
})
