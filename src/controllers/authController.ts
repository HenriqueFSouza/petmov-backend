import 'dotenv/config';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Buscar o usuário no banco de dados pelo email
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Email ou senha incorretos" });
    }

    // Verificar se a senha está correta
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: "Email ou senha incorretos" });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, admin: user.admin }, // Incluindo propriedades relevantes no token
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};
