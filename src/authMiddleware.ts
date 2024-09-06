import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from './userSchema'; // Verifique o caminho correto

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    req.user = decodedToken as User; // Agora o TypeScript deve reconhecer req.user
    next();
  });
};
