import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;

dotenv.config();

// Constrói a string de conexão com o postgresql manualmente
export const connectionString = 'postgresql://postgres:422618@localhost:5432/users';

async function connect() {
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

// Chama a função connect automaticamente
connect();

export async function insertUser(user) {
    const client = await connect();
    const sql = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";

    try {
        const saltRounds = 10; // número de vezes que será aplicado o processo de hashing para fortalecer a segurança
        if (!user.password) {
            throw new Error("Senha não fornecida");
        }
        const hashedPassword = await bcrypt.hash(user.password, saltRounds); // hash final

        // Query para inserir o novo usuário no banco de dados
        const result = await client.query(sql, [user.name, user.email, hashedPassword]);

        console.log("Usuário criado com sucesso: ", result.rows[0]);

        // Retorna o usuário criado
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao inserir usuário no banco de dados: ", error);
        throw error;  // Lança o erro para que a rota capture
    } finally {
        client.release();  // Garante que a conexão com o banco de dados seja liberada
    }
};

export async function userLogin (user) {
    const client = await connect();
    const sql = "SELECT * FROM users WHERE email = $1";
    const jwtSecret = process.env.JWT_SECRET;

    // verifica se o email existe no banco de dados
    try {
        const result = await client.query(sql, [user.email])

        if (!result.rows.length === 0) {
            throw new Error('Email ou senha incorretos.')
        };
    
    const usuario = result.rows[0];

    // Verifica se a senha está correta
    const senhaValida = await bcrypt.compare(user.password, usuario.password) // debugar essa linha

    if (!senhaValida) {
        throw new Error('Email ou senha incorretos.')
    };

    // Se o email e senha estão corretos, gera um JWT
    const token = jwt.sign({ userId: usuario.id, email: usuario.email}, jwtSecret, {expiresIn: 300});

    // Retorna o token
    return { token };
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao autenticar usuário')
  }
};


export default connect;
