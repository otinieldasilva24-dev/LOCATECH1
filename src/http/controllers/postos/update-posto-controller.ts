import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeUpdatePostoUseCase } from "@/use-cases/factories/make-update-posto";

const UpdatePostoSchema = z.object({
  nome: z.string().optional(),
  email_institucional: z.string().email().optional(),
  nif: z.string().optional(),
  tipo: z.enum(["COMBUSTIVEL", "GAS", "MISTO"]).optional(),
  endereco: z.string().optional(),
  horario_funcionamento: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export async function UpdatePostoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = request.params as { id: string };
  const postoId = parseInt(params.id);

  if (isNaN(postoId)) {
    return reply.status(400).send({ message: "ID inválido." });
  }

  const parsed = UpdatePostoSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const useCase = makeUpdatePostoUseCase();
    const { posto } = await useCase.execute({
      id: postoId,
      ...parsed.data,
    });

    return reply.status(200).send({ posto });
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
}
