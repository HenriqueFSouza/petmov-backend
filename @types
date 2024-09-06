// @types/express/index.d.ts
import { User } from '../petmov-backend/src/userSchema'; // Ajuste o caminho conforme necessário

declare global {
  namespace Express {
    interface Request {
      user?: User; // Propriedade opcional para evitar erros
    }
  }
}
