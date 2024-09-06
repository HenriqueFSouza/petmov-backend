import { User } from '../src/userSchema'; // Verifique se o caminho está correto

declare global {
  namespace Express {
    interface Request {
      user?: User; // Aqui informamos que 'req.user' existe
    }
  }
}



