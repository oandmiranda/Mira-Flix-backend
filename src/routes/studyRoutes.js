import express from 'express';
import { showCustomers, showCustomer, insertCustomer, updateCustomer, deleteCustomer, } from '../controllers/study.js';

const router = express();

router.use(express.json());

router.get("/cadastro", (req, res) => {
    res.send('funcionando aq');
});

// operação assíncrona com querie a banco de dados
// retorna o cliente com base no parâmetro "id" enviado no request
router.get("/clientes/:id", async (req, res) => {
    const client = await showCustomer(req.params.id);
    res.json(client);
});

// retorna os clientes da tabela "clientes" do db
router.get("/clientes", async (req, res) => {
    const clientes = await showCustomers();
    res.json(clientes);
});

// cadastra um novo registro
router.post("/clientes", async (req, res) => {
    await insertCustomer(req.body);
    res.sendStatus(201); // "201" é o código que confirma que um novo registro foi realizado DO ZERO com sucesso
});

router.put("/clientes/:id", async (req, res) => {
    await updateCustomer(req.params.id, req.body);
    res.sendStatus(200); // "200" é o código que confirma que o request foi realizado com sucesso
});

router.delete('/clientes/:id', async (req, res) => {
    await deleteCustomer(req.params.id);
    res.sendStatus(204); // "204" é o código que confirma a exclusão do registro
});

router.get("/test", async (req, res) => {
    res.json('a api está funcionando, mas o database não')
})

export default router;