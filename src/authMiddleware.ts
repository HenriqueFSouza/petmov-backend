import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from './userSchema'; 

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    req.user = decodedToken as User; 
    next();
  });
};
