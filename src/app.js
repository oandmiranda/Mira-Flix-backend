import express from 'express';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";
import { corsMiddleware, jsonMiddleware } from './middleware/middeware.js';
import app from './api/index.js';

dotenv.config();

// const app = express();

app.use(jsonMiddleware); // Middleware para JSON
app.use(corsMiddleware); // Middleware CORS configs
app.use('/users', userRoutes); // define as rotas

// export default app;