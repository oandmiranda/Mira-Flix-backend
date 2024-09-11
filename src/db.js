import bcrypt from 'bcrypt';
import pkg from 'pg';
const { Pool } = pkg;


// Constrói a string de conexão com o postgresql manualmente
const connectionString = 'postgresql://postgres:422618@localhost:5432/users';

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

// Função para retornar os dados da tabela 'clientesCasio'
export async function showCustomers() {
    const client = await connect(); // pede uma conexão 

    try {
        const res = await client.query("SELECT * FROM clientes"); // comando SQL para retornar os dados da tabela
        return res.rows; // retorna as linhas da tabela com os dados
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        throw error; // Propaga o erro para que possa ser tratado no local onde a função é chamada
    } finally {
        client.release(); // libera a conexão de volta para o Pool
    }
};

export async function showCustomer(id) {
    const client = await connect();

    try {
        const res = await client.query("SELECT * FROM clientes WHERE id=$1", [id]);
        return res.rows;
    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        throw error;
    } finally {
        client.release();
    }
};

export async function insertCustomer (customer) {
    const client = await connect();
    const sql = "INSERT INTO clientes (nome, email, idade) VALUES ($1, $2, $3)";
    const values = [customer.nome, customer.email, customer.idade];

    try {
        await client.query(sql, values);
    } catch (error) {
        console.error("Insert error: ", error);
        throw error;
    } finally {
        client.release();
    }
};

export async function updateCustomer (id, customer) {
    const client = await connect();
    const sql = "UPDATE clientes SET nome=$1, email=$2, idade=$3 WHERE id=$4";
    const values = [customer.nome, customer.email, customer.idade, id];
    
    try {
        await client.query(sql, values);
    } catch (error) {
        console.error("Update error: ", error);
        throw error;
    } finally {
        client.release();
    }
};

export async function deleteCustomer (id) {
    const client = await connect();
    const sql = "DELETE FROM clientes WHERE id=$1";
    
    try {
        await client.query(sql, [id]);
    } catch (error) {
        console.error("Delete error: ", error);
        throw error;
    } finally {
        client.release();
    }
};

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


export default connect;
