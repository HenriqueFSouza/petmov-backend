import { User } from '../src/userSchema'; 

declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}



