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
  weight: z.coerce.number().positive('O peso deve ser um número positivo'),
  alergic: z.string(),
  breed: z.string().min(1, 'A raça é obrigatóira'),
});

export const createPet = async (req: Request, res: Response) => {
  try {
    // Validando os dados da requisição
    const validatedData = createPetSchema.parse(req.body);

    const owner_id = req.user.id
    // Adicionando o pet ao banco de dados
    const newPet = await prisma.pets.create({
      data: { 
        ...validatedData,
        owner_id
      },
    });

    res.status(201).json({pet: newPet });
  } catch (error) {
    // Retornando erro genérico
    console.log('Erro ao salvar pet:', error)
    res.status(500).json({ error: 'Erro interno' });
  }
};

const updatePetSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').optional(),
  coat: coatEnum.optional(),
  gender: genderEnum.optional(),
  weight: z.coerce.number().positive('O peso deve ser um número positivo').optional(),
  alergic: z.string().optional(),
  breed: z.string().min(1, 'A raça é obrigatória').optional(),
});

export const updatePet = async (req: Request, res: Response) => {
  try {
    // ID do pet a ser atualizado
    const petId = req.params.id;

    // Validando os dados da requisição
    const validatedData = updatePetSchema.parse(req.body);

    const owner_id = req.user.id;

    // Verificando se o pet existe e pertence ao usuário
    const existingPet = await prisma.pets.findFirst({
      where: {
        id: petId,
        owner_id,
      },
    });

    if (!existingPet) {
      return res.status(404).json({ error: 'Pet não encontrado ou não pertence ao usuário' });
    }

    // Atualizando o pet no banco de dados
    const updatedPet = await prisma.pets.update({
      where: { id: petId },
      data: {
        ...validatedData,
      },
    });

    res.status(200).json({ pet: updatedPet });
  } catch (error) {
    console.log('Erro ao atualizar pet:', error);
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


export const getPetById = async (req: Request, res: Response) => {
  try {

    const petId = req.params.id;
    // Buscando os pets do usuário
    const pet = await prisma.pets.findUnique({
      where: {
        id: petId,
      },
    });

    res.status(200).json({ pet });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar os pets' });
  }
};

export const deletePet = async (req: Request, res: Response) => {
  try {

    const petId = req.params.id;
    // Buscando os pets do usuário
    const pet = await prisma.pets.delete({
      where: {
        id: petId,
      },
    });

    res.status(200).json({ pet });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar' });
  }
};

