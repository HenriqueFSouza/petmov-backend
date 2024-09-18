import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();
interface Prices {
  [key: string]: {
    price: string;
    grooming: string;
  };
}

interface Price {
  range: string;
  price: string;
  grooming: string;
}
const priceSchema = z.object({
  price: z.number().positive("O preço deve ser um número positivo"),
  grooming: z
    .number()
    .nonnegative("O valor adicional para tosa deve ser um número não negativo"),
  range: z.string().min(1, "O campo de faixa é obrigatório"),
});

export const savePrices = async (req: Request, res: Response) => {
  try {
    // Validate incoming data with Zod
    const { price, grooming, range } = priceSchema.parse(req.body);

    const user_id = req.user.id;
    // Check if a price for the given range and user already exists
    const existingPrice = await prisma.prices.findFirst({
      where: {
        range,
        user_id,
      },
    });

    if (existingPrice) {
      // Update the existing price
      const updatedPrice = await prisma.prices.update({
        where: {
          id: existingPrice.id,
        },
        data: {
          price,
          grooming,
        },
      });
      return res.status(200).json();
    } else {
      // Create a new price entry
      const newPrice = await prisma.prices.create({
        data: {
          price,
          grooming,
          range,
          user_id,
        },
      });
      return res.status(201).json();
    }
  } catch (error) {
    // Handle other errors
    console.error("Erro ao salvar os preços:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const getPrices = async (req: Request, res: Response) => {
  const user_id = req.user.id;
  try {
    const prices = await prisma.prices.findMany({
      where: {
        user_id,
      },
    });

    // Transformar os preços no formato desejado
    const formattedPrices = prices.reduce((acc: Prices, price: Price) => {
      acc[price.range] = {
        price: price.price.toString(),
        grooming: price.grooming.toString(),
      };
      return acc;
    }, {} as Prices);

    return res.status(200).json(formattedPrices);
  } catch (error) {
    // Handle other errors
    console.error("Erro ao salvar os preços:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
