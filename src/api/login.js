import { userLogin } from '../controllers/userController.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const authenticatedUser = await userLogin(req.body);
      return res.status(authenticatedUser.status || 200).json(authenticatedUser);
    } catch (error) {
      return res.status(500).json({ message: 'Erro no servidor' });
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido' });
  }
}
