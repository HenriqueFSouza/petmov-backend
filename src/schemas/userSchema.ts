import { z } from 'zod';

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

export type User = z.infer<typeof userSchema>;
