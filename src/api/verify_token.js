import { verifyToken } from '../controllers/userController.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    verifyToken(req, res);
  } else {
    return res.status(405).json({ error: 'Método não permitido' });
  }
}
