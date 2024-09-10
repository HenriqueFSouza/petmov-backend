import express from 'express';
import { registerUser, registerAdmin, login } from './authController';
import { authenticateToken } from './authMiddleware';

const app = express();

app.use(express.json());

// Rotas de autenticação
app.post('/register', registerUser);
app.post('/register-admin', registerAdmin);
app.post('/login', login);

// Rota protegida
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acesso concedido à rota protegida' });
});
// Health check route
app.get('/',  (_, res) => {
  res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
