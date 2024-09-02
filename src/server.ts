import express from 'express';
import { registerUser } from './userController';
import { registerAdmin } from './adminController';

const app = express();

app.use(express.json());

app.post('/register', registerUser);
app.post('/register-admin', registerAdmin); // Novo endpoint para cadastrar administrador

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
