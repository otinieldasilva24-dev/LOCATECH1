import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeUpdatePostoUseCase } from "@/use-cases/factories/make-update-posto";
import { prisma } from "@/lib/prisma";
import { getIO } from "@/lib/socket-provider";

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

    // Notifica seguidores sobre a alteração
    const camposAlterados = Object.keys(parsed.data).filter(
      (k) => parsed.data[k as keyof typeof parsed.data] !== undefined
    );
    if (camposAlterados.length > 0) {
      const postoAtual = await prisma.posto.findUnique({
        where: { id: postoId },
        select: { nome: true, gestorId: true },
      });

      if (postoAtual) {
        const notificationContent = `O posto ${postoAtual.nome} atualizou os seus dados (${camposAlterados.join(", ")}).`;

        // Notifica o gestor
        await prisma.notifications.create({
          data: { userId: postoAtual.gestorId, content: notificationContent },
        });

        // Notifica todos os MEMBER
        const membros = await prisma.user.findMany({
          where: { role: "MEMBER" },
        });

        for (const m of membros) {
          await prisma.notifications.create({
            data: { userId: m.id, content: notificationContent },
          });
        }

        // Emite via Socket.IO
        const io = getIO();
        if (io) {
          io.to(postoAtual.gestorId.toString()).emit("nova_notificacao", {
            content: notificationContent,
            created_at: new Date(),
          });
          for (const m of membros) {
            io.to(m.id.toString()).emit("nova_notificacao", {
              content: notificationContent,
              created_at: new Date(),
            });
          }
        }
      }
    }

    return reply.status(200).send({ posto });
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
}
