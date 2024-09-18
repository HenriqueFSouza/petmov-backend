
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Função para encontrar usuário por e-mail
export const findUserByEmail = async (email: string) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

// Função para encontrar usuário por ID
export const findUserById = async (id: string) => {
  return await prisma.users.findUnique({
    where: { id },
  });
};

// Função para atualizar a senha do usuário
export const updateUserPassword = async (id: string, hashedPassword: string) => {
    return await prisma.users.update({
        where: { id },
        data: { password_hash: hashedPassword },
      });
      
};
