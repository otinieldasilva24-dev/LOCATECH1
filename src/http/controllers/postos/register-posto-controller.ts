
import { RegisterPostoUseCase } from '@/use-cases/register-posto-use-case';
import { ZodError } from 'zod';
import { registerPostoSchema } from './postos-controller.type';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function RegisterPostosController(req: FastifyRequest, res: FastifyReply) {
    try {
      const data = registerPostoSchema.parse(req.body);
      const registerPostoUseCase = new RegisterPostoUseCase();
      const { posto } = await registerPostoUseCase.execute(data);

      return res.status(201).send(posto);

    } catch (err) {
 
      if (err instanceof ZodError) {
        return res.status(400).send({
          message: "Erro de validação",
          errors: err.flatten().fieldErrors
        });
      }

      const errorMessage = err instanceof Error ? err.message : 'Erro interno';
      
      if (errorMessage.includes("Já existe")) {
        return res.status(409).send({ message: errorMessage });
      }

      return res.status(500).send({ message: "Erro inesperado no servidor" });
    }
  }
