import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connect } from "../database/db.js";

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
    const jwtSecret = process.env.JWT_SECRET;

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

    // Se o email e senha estão corretos, gera um JWT
    const token = jwt.sign({ userId: existingUser.id, email: existingUser.email}, jwtSecret, {expiresIn: 300});

    // Retorna o token
    return { token };

  } catch (error) {
    console.error(error);
    throw new Error('Erro ao autenticar usuário')
  }
};