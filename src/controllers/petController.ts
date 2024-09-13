import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createPet = async (req: Request, res: Response) => {
    try {
      const { name, coat, gender, weight, owner_id } = req.body;
  
      const newPet = await prisma.pets.create({
        data: {
          name,
          coat,
          gender,
          weight,
          owner_id,
        },
      });
  
      res.status(201).json(newPet);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao cadastrar o pet' });
    }
  };
  
