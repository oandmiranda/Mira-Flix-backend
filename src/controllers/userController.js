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
        return {
            status: 201,
            message: "Usuário criado com sucesso",
            user: newUser.rows[0] // opcional: retorna os dados do usuário criado
        };

    } catch (error) {
        console.error("Erro ao inserir usuário no banco de dados: ", error);
        return {
            status: 400,
            message: error.message || 'Erro ao inserir usuário no banco de dados',
        }
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

        if (result.rows.length === 0) {
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
    const token = jwt.sign({ userId: existingUser.id, email: existingUser.email}, secret_key, {expiresIn: '120s'});

    // Retorna o token
    console.log('token gerado: ', token);
    return {
        token: token,
        name: existingUser.name
    };

  } catch (error) {
    console.error(error.message);
    return {
        status: 401, // Retorna um código HTTP de 'não autorizado' 
        message: error.message || 'Erro ao autenticar usuário',
      };
  }
};

export function verifyToken(req, res) {
    const authHeader  = req.headers['authorization'];
  
    console.log("Token recebido:", authHeader );
  
    if (!authHeader ) {
        return res.status(403).json({ message: "token não recebido" });
    }
  
    // Extrai o token após o 'bearer'
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "Token não fornecido na extração do bearer" });
    }
  
    // check the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Verifique se o erro é devido a assinatura inválida
            if (err.name === 'TokenExpiredError') {
                console.log("Token expirado:", err.message);
                return res.status(401).json({ message: "Token expirado" });
              }

            console.error("Erro ao verificar o token:", err);
            return res.status(403).json({ message: "Token inválido" });
        }
  
        console.log("Token válido:", decoded);
        req.user = decoded; // Adiciona as informações decodificadas ao objeto req
        return res.status(200).json({message: "token verificado"});
    });
}