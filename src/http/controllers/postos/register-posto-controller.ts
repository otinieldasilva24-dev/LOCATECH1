import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { makeCreateNotification } from "@/use-cases/factories/make-createNotification";
import { getIO } from "@/lib/socket-provider";

const RegisterPostoSchema = z.object({
  nome:                   z.string(),
  email_institucional:    z.string().email().optional(),
  nif:                    z.string(),
  tipo:                   z.enum(["COMBUSTIVEL", "GAS", "MISTO"]).default("MISTO"),
  endereco:               z.string().optional(),
  horario_funcionamento:  z.string().optional(),
  gestorId:               z.coerce.number(),
  latitude:               z.coerce.number().optional(),
  longitude:              z.coerce.number().optional(),
});

export async function RegisterPosto(request: FastifyRequest, reply: FastifyReply) {
    console.log("BODY:", request.body)
  console.log("FILE:", (request as any).file)
  console.log("RAW BODY:", (request.raw as any).body)

  const parsed = RegisterPostoSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const file = (request as any).file;
  const alvara_path: string | undefined = file?.filename;
  console.log(parsed)

  
  const postoExistente = await prisma.posto.findUnique({
    where: { nif: parsed.data.nif },
  });

  if (postoExistente) {
    return reply.status(409).send({ message: "Já existe um posto com este NIF." });
  }
  console.log("ENTREIIIIIIIIIIIIIIIIIIIIII")
  const posto = await prisma.posto.create({
    data: {
      ...parsed.data,
      alvara_path,
    },
  });

  const notificationContent = `O posto ${posto.nome} foi registado com sucesso.`;

  try {
    const usecase = makeCreateNotification();

    const membros = await prisma.user.findMany({
      where: { role: "MEMBER" },
    });

    for (const m of membros) {
      await usecase.execute({
        userId: m.id,
        content: `Novo posto disponível: ${posto.nome} foi registado na plataforma.`,
      });
    }

    const io = getIO();
    if (!io) {
      console.error("⚠️ Socket.IO não disponível — notificação não emitida.");
    } else {
      for (const m of membros) {
        io.to(m.id.toString()).emit("nova_notificacao", {
          content: `Novo posto disponível: ${posto.nome} foi registado na plataforma.`,
          created_at: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("⚠️ Erro ao gerar notificações:", error);
  }

  return reply.status(201).send({ posto });
}