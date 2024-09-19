import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { defaultAgenda } from "../constants/defaultAgenda";

const prisma = new PrismaClient();

export const getAgenda = async (_: Request, res: Response) => {
  try {
    const agenda = await prisma.agenda.findFirst({
      where: {
        id: 1,
      },
    });

    const prices = await prisma.prices.findMany({
      where: {
        user_id: agenda?.user_id,
      },
    });
    return res.status(201).json({agenda, prices});
  } catch (err) {
    return res.status(500).json();
  }
};

export const createNewAgenda = async (user_id: string) => {
  try {
    await prisma.agenda.create({
      data: {
        user_id,
        ...defaultAgenda,
      },
    });
    return;
  } catch (err) {
    throw Error();
  }
};
