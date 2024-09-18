import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';

const prisma = new PrismaClient();

// Definindo os enums Coat e Gender conforme o Prisma
const coatEnum = z.enum(['SHORT', 'MEDIUM', 'LONG']); // Adapte as opções conforme seu schema Prisma
const genderEnum = z.enum(['MALE', 'FEMALE']); // Adapte as opções conforme seu schema Prisma

// Criando o schema de validação do Zod
const createPetSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  coat: coatEnum,
  gender: genderEnum,
  weight: z.number().positive('O peso deve ser um número positivo'),
  owner_id: z.string().uuid('O ID do proprietário deve ser um UUID válido'),
});

export const createPet = async (req: Request, res: Response) => {
  try {
    // Validando os dados da requisição
    const validatedData = createPetSchema.parse(req.body);

    // Adicionando o pet ao banco de dados
    const newPet = await prisma.pets.create({
      data: validatedData,
    });

    res.status(201).json({pet: newPet });
  } catch (error) {
    // Retornando erro genérico
    res.status(500).json({ error: 'Erro interno' });
  }
};


export const getPets = async (req: Request, res: Response) => {
  try {
    // Obtendo o user.id do request
    const userId = req.user.id;

    // Buscando os pets do usuário
    const pets = await prisma.pets.findMany({
      where: {
        owner_id: userId,
      },
    });

    res.status(200).json({ pets });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar os pets' });
  }
};

