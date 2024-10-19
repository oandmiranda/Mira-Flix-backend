import express from 'express';
import cors from 'cors';

export const corsOpitions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200
}

// Middleware CORS
export const corsMiddleware = cors(corsOpitions);

// Middleware para entender request com JSON
export const jsonMiddleware = express.json();