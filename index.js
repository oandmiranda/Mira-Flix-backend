import express from 'express';
import dotenv from 'dotenv';
import { showCustomers, showCustomer, insertCustomer, updateCustomer, deleteCustomer } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/cadastro", (req, res) => {
    res.send('funcionando aq');
});

// operação assíncrona com querie a banco de dados
// retorna o cliente com base no parâmetro "id" enviado no request
app.get("/clientes/:id", async (req, res) => {
    const client = await showCustomer(req.params.id);
    res.json(client);
});

// retorna os clientes da tabela "clientes" do db
app.get("/clientes", async (req, res) => {
    const clientes = await showCustomers();
    res.json(clientes);
});

// cadastra um novo registro
app.post("/cliente", async (req, res) => {
    await insertCustomer(req.body);
    res.sendStatus(201); // "201" é o código que confirma que um novo registro foi realizado DO ZERO com sucesso
});

app.put("/clientes/:id", async (req, res) => {
    await updateCustomer(req.params.id, req.body);
    res.sendStatus(200); // "200" é o código que confirma que o request foi realizado com sucesso
});

app.delete('/clientes/:id', async (req, res) => {
    await deleteCustomer(req.params.id);
    res.sendStatus(204); // "204" é o código que confirma a exclusão do registro
});

// login
app.post("/login", async (req, res) => {

});

// cadastro
app.post("/cadastro", async (req, res) => {

});


app.listen(port);