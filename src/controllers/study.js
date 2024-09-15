import { connect } from "../database/db.js";

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