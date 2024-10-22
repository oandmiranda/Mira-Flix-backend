import express from 'express';
import cors from 'cors';

export const corsOpitions = {
    origin: [
        'http://localhost:3000', 
        'https://mira-flix-frontend.vercel.app', 
        'https://mira-flix-frontend-git-dev-oandmirandas-projects.vercel.app'  // Adicione essa URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware CORS
export const corsMiddleware = cors(corsOpitions);

// Middleware para entender request com JSON
export const jsonMiddleware = express.json();