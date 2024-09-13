import express from 'express';
import { registerUser } from './userController';
import petRoutes from './routes/petRoutes';

const app = express();

app.use(express.json());

app.post('/register', registerUser);

app.use('/api', petRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



