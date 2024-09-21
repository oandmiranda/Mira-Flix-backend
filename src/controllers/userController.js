import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connect } from "../database/db.js";
import dotenv from "dotenv";

dotenv.config();

export async function insertUser(user) {
    const {name, email, password} = user;
    const client = await connect();
    const sql = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";

    try {
        const saltRounds = 10; // número de vezes que será aplicado o processo de hashing para fortalecer a segurança
        if (!user.password) {
            throw new Error("Senha não fornecida");
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds); // hash final

        // Query para inserir o novo usuário no banco de dados
        const newUser = await client.query(sql, [name, email, hashedPassword]);

        console.log("Usuário criado com sucesso: ", newUser.rows[0]);

        // Retorna o usuário criado
        return newUser.rows[0];
    } catch (error) {
        console.error("Erro ao inserir usuário no banco de dados: ", error);
        throw error;  // Lança o erro para que a rota capture
    } finally {
        client.release();  // Garante que a conexão com o banco de dados seja liberada
    }
};

export async function userLogin (user) {
    const { email, password } = user;
    const client = await connect();
    const sql = "SELECT * FROM users WHERE email = $1";
    const secret_key = process.env.JWT_SECRET;

    // verifica se o email existe no banco de dados
    try {
        const result = await client.query(sql, [email])

        if (!result.rows.length === 0) {
            throw new Error('Email ou senha incorretos.')
        };
    
    // armazena o usuário existente
    const existingUser = result.rows[0];

    // Verifica se a senha está correta
    const senhaValida = await bcrypt.compare(password, existingUser.password)

    if (!senhaValida) {
        throw new Error('Email ou senha incorretos.')
    };

    // Se o email e senha estão corretos, gera um token
    const token = jwt.sign({ userId: existingUser.id, email: existingUser.email}, secret_key, {expiresIn: 30000});

    // Retorna o token
    return { token };

  } catch (error) {
    console.error(error);
    throw new Error('Erro ao autenticar usuário')
  }
};

export function verifyToken(req, res) {
    const token = req.headers['authorization'];
  
    console.log("Token recebido:", token);
  
    if (!token) {
        return res.status(403).json({ message: "erro no primeiro log: token não recebido" });
    }
  
    // Extrai o token após o 'Bearer'
    const bearerToken = token.split(' ')[1];
    if (!bearerToken) {
        return res.status(403).json({ message: "Token não fornecido na extração do bearer" });
    }

    console.log("Bearer token extraído:", bearerToken);
  
    // Verifica o token
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Verifique se o erro é devido a assinatura inválida
            if (err.name === 'JsonWebTokenError') {
                console.error("Erro de assinatura:", err.message);
                return res.status(403).json({ message: "Token inválido" });
            }
            console.error("Erro ao verificar o token:", err);
            return res.status(403).json({ message: "Token inválido" });
        }
  
        console.log("Token decodificado:", decoded);
        req.user = decoded; // Adiciona as informações decodificadas ao objeto req
    });
}

  

