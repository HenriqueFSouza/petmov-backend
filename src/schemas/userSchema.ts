import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

interface RequestWithParams extends Request {
  params: {
    id: string;
  };
}
const prisma = new PrismaClient();


export const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato inválido (00) 00000-0000'),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  admin: z.boolean()
});

export const adminSchema = userSchema.extend({
  isAdmin: z.boolean().optional(),
});

export const userAgendaSchema = z.object({
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
  ),
  service_duration: z.number(),
})

export const userIdSchema = z.object({
  id: z.string().uuid(),
});


export const getUserProfile = async (req:Request, res: Response) => {
    const { id } = req.params;

    // Validação
    const parseResult = userIdSchema.safeParse({ id });
    if (!parseResult.success) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
    }
};

export type User = z.infer<typeof userSchema>;
