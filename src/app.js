import express from 'express';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware para entender requisições com JSON
app.use(express.json());

// define as rotas
app.use('/users', userRoutes);

export default app;