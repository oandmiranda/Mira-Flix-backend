import express from 'express';
import { insertUser, userLogin } from '../controllers/userController.js';

const router = express();

router.use(express.json());

// login
router.post("/login", async (req, res) => {
    try {
        const userValidado = await userLogin(req.body);
        res.json({auth: true, userValidado});
    } catch (error) {
        res.status(500).json({error: "erro ao autorizar user"});
    }
});

// cadastro
router.post("/cadastro", async (req, res) => {
    try {
        const newUser = await insertUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: "erro ao criar user"});
    }
});

export default router;