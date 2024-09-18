import { Request, Response, Router } from "express";
import { createPet, getPets } from "../controllers/petController";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  createNewService,
  getFreeTimesServices,
} from "../controllers/serviceController";
import { getUserProfile, registerUser } from "../controllers/userController";
import { login } from "../controllers/authController";
import { getAgenda } from "../controllers/agendaController";
import { emailSchema, resetPasswordSchema } from "../schemas/passwordSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { findUserByEmail, findUserById, updateUserPassword } from '../utils/userUtils';

const routes = Router();

// Autenticação
routes.post("/sessions", login);

// User routes
routes.post("/users", registerUser);

// Auth check route
routes.get("/auth", authenticateToken, (req: Request, res: Response) => {
  return res.status(200);
});

// Profile route
routes.get("/profile", authenticateToken, getUserProfile);

// Admin User routes
routes.get("/agenda", authenticateToken, getAgenda);

// Pet routes
routes.post("/pet", authenticateToken, createPet);
routes.get("/pet", authenticateToken, getPets);

// Services routes
routes.get("/service/:date", authenticateToken, getFreeTimesServices);
routes.post("/service", authenticateToken, createNewService);

// Configuração para envio de e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Rota para solicitar recuperação de senha
routes.post("/forgot-password", async (req, res) => {
  try {
    const { email } = emailSchema.parse(req.body);

    // Verificar se o e-mail existe no banco de dados (essa é uma simulação)
    const user = await findUserByEmail(email); // Função fictícia
    if (!user) {
      return res.status(400).json({ message: "E-mail não encontrado" });
    }

    // Criar token de redefinição de senha
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h", // Expira em 1 hora
    });

    // Enviar e-mail com o link de redefinição
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de Senha",
      text: `Clique no link para redefinir sua senha: ${resetLink}`,
    });

    res.status(200).json({ message: "E-mail enviado com sucesso" });
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
});
// 2. Rota para redefinir a senha
routes.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };


    // Buscar usuário pelo ID decodificado
    const user = await findUserById(decoded.id); // Função fictícia
    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar senha do usuário no banco de dados (simulação)
    await updateUserPassword(user.id, hashedPassword); // Função fictícia

    res.status(200).json({ message: "Senha redefinida com sucesso" });
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
});

//get profile users

routes.get('/users/:id', getUserProfile);

export default routes;
