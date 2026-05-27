import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "../middleware/verify-jwt";
import { getIO } from "@/lib/socket-provider";

const CreateConviteSchema = z.object({
  para_user_id: z.number().int().positive(),
  comunidade_id: z.number().int().positive(),
});

export async function CreateConviteController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = CreateConviteSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const deUserId = Number(request.user?.sub);
  const { para_user_id, comunidade_id } = parsed.data;

  // Verifica se a comunidade existe
  const comunidade = await prisma.comunidade.findUnique({
    where: { id: comunidade_id },
  });
  if (!comunidade) {
    return reply.status(404).send({ message: "Comunidade não encontrada." });
  }

  // Verifica se o utilizador já é membro
  const jaMembro = await prisma.comunidadeMembro.findUnique({
    where: { user_id_comunidade_id: { user_id: para_user_id, comunidade_id } },
  });
  if (jaMembro) {
    return reply.status(400).send({ message: "Utilizador já é membro desta comunidade." });
  }

  // Verifica se já existe convite pendente
  const conviteExistente = await prisma.convite.findFirst({
    where: {
      de_user_id: deUserId,
      para_user_id,
      comunidade_id,
      status: "PENDENTE",
    },
  });
  if (conviteExistente) {
    return reply.status(400).send({ message: "Já existe um convite pendente para este utilizador." });
  }

  const convite = await prisma.convite.create({
    data: {
      de_user_id: deUserId,
      para_user_id,
      comunidade_id,
    },
    include: {
      de_user: { select: { id: true, nome: true } },
      para_user: { select: { id: true, nome: true } },
      comunidade: { select: { id: true, nome: true } },
    },
  });

  // Emite evento Socket.IO em tempo real
  const io = getIO();
  if (io) {
    io.to(para_user_id.toString()).emit("convite_recebido", {
      id: convite.id,
      de_user: convite.de_user,
      comunidade: convite.comunidade,
      created_at: convite.created_at,
    });
  }

  return reply.status(201).send({ convite });
}

export async function ListConvitesPendentesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = Number(request.user?.sub);

  const convites = await prisma.convite.findMany({
    where: { para_user_id: userId, status: "PENDENTE" },
    include: {
      de_user: { select: { id: true, nome: true } },
      comunidade: { select: { id: true, nome: true, descricao: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return reply.send({ convites });
}

export async function ResponderConviteController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = request.params as { id: string };
  const conviteId = parseInt(params.id);
  if (isNaN(conviteId)) {
    return reply.status(400).send({ message: "ID inválido." });
  }

  const schema = z.object({
    acao: z.enum(["ACEITE", "RECUSADO"]),
  });
  const parsed = schema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ message: "Ação inválida. Use ACEITE ou RECUSADO." });
  }

  const userId = Number(request.user?.sub);
  const { acao } = parsed.data;

  const convite = await prisma.convite.findUnique({ where: { id: conviteId } });
  if (!convite || convite.para_user_id !== userId) {
    return reply.status(404).send({ message: "Convite não encontrado." });
  }
  if (convite.status !== "PENDENTE") {
    return reply.status(400).send({ message: "Este convite já foi respondido." });
  }

  await prisma.convite.update({
    where: { id: conviteId },
    data: { status: acao },
  });

  if (acao === "ACEITE") {
    await prisma.comunidadeMembro.create({
      data: {
        user_id: userId,
        comunidade_id: convite.comunidade_id,
      },
    });
  }

  return reply.send({ message: `Convite ${acao === "ACEITE" ? "aceite" : "recusado"} com sucesso.` });
}

export async function ListComunidadesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = Number(request.user?.sub);

  const comunidades = await prisma.comunidade.findMany({
    include: {
      criador: { select: { id: true, nome: true } },
      membros: { where: { user_id: userId }, take: 1 },
      _count: { select: { membros: true } },
    },
    orderBy: { created_at: "desc" },
  });

  const result = comunidades.map((c) => ({
    id: c.id,
    nome: c.nome,
    descricao: c.descricao,
    criador: c.criador,
    total_membros: c._count.membros,
    eh_membro: c.membros.length > 0,
  }));

  return reply.send({ comunidades: result });
}

export async function CreateComunidadeController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const schema = z.object({
    nome: z.string().min(1, "Nome é obrigatório."),
    descricao: z.string().optional(),
  });

  const parsed = schema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const userId = Number(request.user?.sub);

  const comunidade = await prisma.comunidade.create({
    data: {
      nome: parsed.data.nome,
      descricao: parsed.data.descricao,
      created_by: userId,
    },
  });

  // Quem cria é automaticamente membro
  await prisma.comunidadeMembro.create({
    data: {
      user_id: userId,
      comunidade_id: comunidade.id,
    },
  });

  return reply.status(201).send({ comunidade });
}

export async function ComunidadeRoutes(app: FastifyInstance) {
  const opts = { preHandler: [verifyJWT] };

  app.post("/comunidades", opts, CreateComunidadeController);
  app.get("/comunidades", opts, ListComunidadesController);
  app.post("/convites", opts, CreateConviteController);
  app.get("/convites/pendentes", opts, ListConvitesPendentesController);
  app.patch("/convites/:id/responder", opts, ResponderConviteController);
}
