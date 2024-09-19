import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { defaultAgenda } from "../constants/defaultAgenda";
import { z } from "zod";

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

const createBodySchema = z.object({
  service_duration: z.number().
    min(0.5, "A duração mínima de uma reunião é de 30 minutos")
    .max(2, "A duração máxima de uma reunião é de 120 minutos"),
  weekly_hours: z.array(
    z.object({
      name: z.string(),
      available: z.boolean(),
      hours: z.array(
        z.object({
          start_hour: z.string().nullable(),
          end_hour: z.string().nullable()
        })
      )
    })
  ).optional(),
})

export const updateAgenda = async (req: Request, res: Response) => {
  try {
    // Validação dos dados recebidos
    const { service_duration, weekly_hours } = createBodySchema.parse(req.body);

    // Parsing dos horários
    const parsedWeeklyHours = weekly_hours?.map(weekly_hour => ({
      available: weekly_hour.available,
      name: weekly_hour.name,
      hours: weekly_hour.hours
        .map(hour =>
          hour.start_hour && hour.end_hour
            ? {
              start_hour: hour.start_hour,
              end_hour: hour.end_hour
            }
            : { start_hour: '', end_hour: '' } // Valores padrão
        )
        .filter(val => val.start_hour !== '' && val.end_hour !== '') // Filtra valores padrão
    }));

    // Atualização da agenda no banco de dados
    const updatedAgenda = await prisma.agenda.update({
      where: { id: 1 }, // ID da agenda a ser atualizada
      data: {
        service_duration,
        weekly_hours: parsedWeeklyHours, // Use os horários parseados
      },
    });

    return res.status(200).json(updatedAgenda);
  } catch (error) {
    console.error('Erro ao atualizar a agenda:', error);
    return res.status(500).json({ message: "Erro ao atualizar a agenda" });
  }
};
