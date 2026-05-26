import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { getIO } from "@/lib/socket-provider";

const UpdateStockSchema = z.object({
  preco_unitario: z.coerce.number().positive().optional(),
  quantidade_atual: z.coerce.number().optional(),
  capacidade_maxima: z.coerce.number().optional(),
});

export async function UpdateStockController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = request.params as { id: string };
  const stockId = parseInt(params.id);

  if (isNaN(stockId)) {
    return reply.status(400).send({ message: "ID inválido." });
  }

  const parsed = UpdateStockSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    // Busca stock atual para comparar preço
    const stockAtual = await prisma.stock.findUnique({
      where: { id: stockId },
      include: { posto: { select: { nome: true, gestorId: true } }, produto: true },
    });

    if (!stockAtual) {
      return reply.status(404).send({ message: "Stock não encontrado." });
    }

    const stock = await prisma.stock.update({
      where: { id: stockId },
      data: parsed.data,
      include: { produto: true },
    });

    // Gera notificação se o preço foi alterado
    if (parsed.data.preco_unitario !== undefined) {
      const precoAntigo = stockAtual.preco_unitario;
      const precoNovo = parsed.data.preco_unitario;

      if (precoAntigo !== precoNovo) {
        const notificationContent = `O preço do ${stockAtual.produto.nome} no posto ${stockAtual.posto.nome} foi alterado de ${precoAntigo} Kz para ${precoNovo} Kz.`;

        // Notifica o gestor do posto
        await prisma.notifications.create({
          data: {
            userId: stockAtual.posto.gestorId,
            content: notificationContent,
          },
        });

        // Notifica todos os MEMBER sobre a alteração de preço
        const membros = await prisma.user.findMany({
          where: { role: "MEMBER" },
        });

        for (const m of membros) {
          await prisma.notifications.create({
            data: { userId: m.id, content: notificationContent },
          });
        }

        // Emite evento via Socket.IO para todos
        const io = getIO();
        if (io) {
          io.to(stockAtual.posto.gestorId.toString()).emit('nova_notificacao', {
            content: notificationContent,
            created_at: new Date(),
          });
          for (const m of membros) {
            io.to(m.id.toString()).emit('nova_notificacao', {
              content: notificationContent,
              created_at: new Date(),
            });
          }
        } else {
          console.error("⚠️ Socket.IO não disponível — notificação de stock não emitida.");
        }
      }
    }

    return reply.status(200).send({ stock });
  } catch (error) {
    console.error("Erro ao atualizar stock:", error);
    return reply.status(404).send({ message: "Stock não encontrado." });
  }
}
