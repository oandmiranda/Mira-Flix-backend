// Este arquivo é o ponto de entrada do servidor e apenas importa a aplicação (contida em app.js) e inicia o servidor:
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});