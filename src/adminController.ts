import { Request, Response } from 'express';
import { adminSchema, Admin } from './adminSchema';

export const registerAdmin = (req: Request, res: Response) => {
  const result = adminSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const admin: Admin = result.data;
  // Aqui faz a lógica para salvar o administrador no banco de dados.

  res.status(201).json({ message: "Administrador cadastrado com sucesso", admin });
};
