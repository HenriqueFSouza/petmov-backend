import { Request, Response } from 'express';
import { userSchema, User } from './userSchema';

export const registerUser = (req: Request, res: Response) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const user: User = result.data;
  // Aqui você faria a lógica para salvar o usuário no banco de dados.

  res.status(201).json({ message: "Usuário cadastrado com sucesso", user });
};
