import { Request, Response } from "express";
import { userAgendaSchema, userSchema } from "../schemas/userSchema";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createNewAgenda } from "./agendaController";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  // Validar o corpo da requisição com o Zod
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const user = result.data;

  try {
    // Verificar se o email já existe no banco de dados
    const existingUser = await prisma.users.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email já cadastrado" });
    }

    const password_hash = await bcrypt.hash(user.password, 10);

    // Registrar o novo usuário no banco de dados
    const newUser = await prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password_hash,
        admin: user.admin,
      },
    });

    if (user.admin) {
      await createNewAgenda(newUser.id);
    }
    // Retornar sucesso
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // Extrair o ID do usuário de req.user
    const userId = req.user?.id; // Certifique-se de que req.user contém o ID do usuário

    if (!userId) {
      return res.status(400).json({ message: "ID do usuário não fornecido." });
    }

    // Buscar os dados do usuário no banco de dados
    const userProfile = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      // Selecione apenas os campos necessários
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        admin: true,
        // Não selecione a senha por motivos de segurança
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Retornar os dados do perfil do usuário
    return res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const createUserAgenda = async (req: Request, res: Response) => {
  const result = userAgendaSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const user_id = req.user.id;

  try {
    await prisma.agenda.create({
      data: {
        user_id,
        weekly_hours: result.data.weekly_hours,
        service_duration: result.data.service_duration,
      },
    });

    return res.status(201).json();
  } catch (err) {
    return res.status(500).json();
  }
};
