import { ZodError } from 'zod';
import {  Request, Response } from 'express';

function errorHandler(err: any, _: Request, res: Response,) {
  // Verifica se é um erro do Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: err.errors.map(e => ({
        path: e.path,
        message: e.message,
      })),
    });
  }

  // Lida com outros erros
  return res.status(500).json({ message: 'Erro interno do servidor' });
}

export default errorHandler;
