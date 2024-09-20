import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    // O ID da agenda do admin é 1, conforme especificado
    const adminAgendaId = 1;

    // Data atual
    const today = new Date();

    // Data de 7 dias atrás
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // 1. Média do valor dos serviços nos últimos 7 dias
    const averageServicePrice = await prisma.services.aggregate({
        where: {
            selected_date: {
                gte: sevenDaysAgo,
                lte: today,
            },
        },
        _avg: {
          price: true,
        },
    });

    // 2. Quantidade de serviços prestados nos últimos 7 dias
    const serviceCount = await prisma.services.count({
      where: {
        selected_date: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
    });

    // 3. Listar os próximos 5 serviços
    const nextFiveServices = await prisma.services.findMany({
      where: {
        selected_date: {
          gte: today, // Serviços futuros
        },
      },
      include: {
        pet: true, // Incluir os dados do pet relacionado ao serviço
      },
      orderBy: {
        selected_date: 'asc', // Ordenar pelo serviço mais próximo
      },
      take: 5, // Limitar para os próximos 5 serviços
    });

    console.log(averageServicePrice)

    // Retornar os dados para o dashboard
    return res.json({
      averageServicePrice: averageServicePrice._avg.price || 0, // Média dos serviços
      serviceCount, // Quantidade de serviços nos últimos 7 dias
      nextFiveServices, // Próximos 5 serviços
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard admin:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do dashboard admin' });
  }
};
