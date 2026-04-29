import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

export async function FetchPostoByIdController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = request.params as { id: string };
  const postoId = parseInt(params.id);

  if (isNaN(postoId)) {
    return reply.status(400).send({ message: "ID inválido." });
  }

  const posto = await prisma.posto.findUnique({
    where: { id: postoId },
    include: {
      stocks: {
        include: {
          produto: true,
        },
      },
    },
  });

  if (!posto) {
    return reply.status(404).send({ message: "Posto não encontrado." });
  }

  return reply.status(200).send({ posto });
}
