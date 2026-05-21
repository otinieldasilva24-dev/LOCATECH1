import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@/lib/prisma';

export async function FetchProdutosController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const produtos = await prisma.produto.findMany({
    orderBy: { nome: 'asc' },
  });

  return reply.status(200).send({ produtos });
}
