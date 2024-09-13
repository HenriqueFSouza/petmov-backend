import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userSchema, adminSchema, User, Admin } from '../schemas/userSchema'; // Ajuste de import
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
const users: User[] = []; // Simulação de um banco de dados em memória

// Registrar usuário
export const registerUser = async (req: Request, res: Response) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const user: User = result.data;
  user.password = await bcrypt.hash(user.password, 10); // Hash da senha
  users.push(user); // Simulação de salvar no banco de dados

  res.status(201).json({ message: "Usuário cadastrado com sucesso" });
};

// Registrar administrador
export const registerAdmin = async (req: Request, res: Response) => {
  const result = adminSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const admin: Admin = result.data;
  admin.password = await bcrypt.hash(admin.password, 10); // Hash da senha
  users.push(admin); // Simulação de salvar no banco de dados

  res.status(201).json({ message: "Administrador cadastrado com sucesso" });
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "Email ou senha incorretos" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: "Email ou senha incorretos" });

  // Gerar o token JWT
  const token = jwt.sign({ email: user.email, isAdmin: (user as Admin).isAdmin }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: "Login bem-sucedido", token });
};
