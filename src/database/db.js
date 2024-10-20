// dbConnection.js
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

// Constrói a string de conexão com o postgresql manualmente
const connectionString = process.env.DATABASE_URL;

export async function connect() {
    // Verifica se já existe uma conexão globalmente
    if (!global.connection) {
        global.connection = new Pool({
            connectionString: connectionString
        });
        console.log('Criou o pool de conexão global');
    }

    // Obtém uma conexão
    return global.connection.connect();
};
