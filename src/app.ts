import express from 'express';
import { registerUser } from './userController';

const app = express();

app.use(express.json());

app.post('/register', registerUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
