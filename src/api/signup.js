import { insertUser } from '../controllers/userController.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newUser = await insertUser(req.body);
      return res.status(newUser.status).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar usuário" });
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido' });
  }
}
