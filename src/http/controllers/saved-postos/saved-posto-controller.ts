import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeSavePostoUseCase } from "@/use-cases/factories/make-save-posto";
import { makeGetSavedPostosUseCase } from "@/use-cases/factories/make-get-saved-postos";
import { verifyJWT } from "../middleware/verify-jwt";

export async function toggleSavePosto(request: FastifyRequest, reply: FastifyReply) {
  const toggleSaveSchema = z.object({
    postoId: z.coerce.number(),
  });

  const { postoId } = toggleSaveSchema.parse(request.params);
  const userId = Number(request.user.sub);

  const useCase = makeSavePostoUseCase();
  const { saved } = await useCase.execute({ userId, postoId });

  return reply.status(200).send({ saved });
}

export async function getSavedPostos(request: FastifyRequest, reply: FastifyReply) {
  const userId = Number(request.user.sub);

  const useCase = makeGetSavedPostosUseCase();
  const { postos } = await useCase.execute(userId);

  return reply.status(200).send({ postos });
}
