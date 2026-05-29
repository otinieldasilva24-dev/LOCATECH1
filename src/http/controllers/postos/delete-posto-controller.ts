import { FastifyRequest, FastifyReply } from "fastify";
import { makeDeletePostoUseCase } from "@/use-cases/factories/make-delete-posto";

export async function DeletePostoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = request.params as { id: string };
  const postoId = parseInt(params.id);

  if (isNaN(postoId)) {
    return reply.status(400).send({ message: "ID inválido." });
  }

  try {
    const useCase = makeDeletePostoUseCase();
    await useCase.execute(postoId);
    return reply.status(200).send({ message: "Posto eliminado com sucesso." });
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
}
