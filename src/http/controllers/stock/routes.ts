import { FastifyInstance } from "fastify";
import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";


const CreateStockSchema = z.object({
  postoId:          z.coerce.number(),
  produtoId:        z.coerce.number(),
  preco_unitario:   z.coerce.number().positive("Preço deve ser positivo."),
  quantidade_atual: z.coerce.number().default(0),
  capacidade_maxima: z.coerce.number().default(0),
});

export async function CreateStock(request: FastifyRequest, reply: FastifyReply) {
  const parsed = CreateStockSchema.safeParse(request.body);
  console.log(parsed)

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const stock = await prisma.stock.create({
    data: parsed.data,
  });

  return reply.status(201).send({ stock });
}

export async function StocksRoutes(app: FastifyInstance) {
  app.post("/stocks", CreateStock);
}