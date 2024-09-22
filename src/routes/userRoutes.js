import express from 'express';
import { insertUser, userLogin, verifyToken } from '../controllers/userController.js';

const router = express();

router.use(express.json());

// cadastro
router.post("/cadastro", async (req, res) => {
    try {
        const newUser = await insertUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: "erro ao criar user"});
    }
});

// login
router.post("/login", async (req, res) => {
    try {
        const authenticatedUser = await userLogin(req.body);
        res.json({auth: true, authenticatedUser});
    } catch (error) {
        res.status(401).json({error: "erro ao autorizar user"});
    }
});


router.get('/verify_test', verifyToken, (req, res) => {
    // Se o token for válido, o código desta rota será executado
    res.json({ message: 'Acesso permitido à rota de categorias', user: req.user });
});

export default router;