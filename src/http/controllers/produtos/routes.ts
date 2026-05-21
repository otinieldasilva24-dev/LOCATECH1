import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { FetchProdutosController } from './fetch-produtos-controller';

const CreateProdutoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.'),
  unidade_medida: z.string().min(1, 'Unidade de medida é obrigatória.'),
});

async function CreateProdutoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = CreateProdutoSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      message: 'Dados inválidos.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const produto = await prisma.produto.create({
    data: parsed.data,
  });

  return reply.status(201).send({ produto });
}

export async function ProdutosRoutes(app: FastifyInstance) {
  app.get('/produtos', FetchProdutosController);
  app.post('/produtos', CreateProdutoController);
}

