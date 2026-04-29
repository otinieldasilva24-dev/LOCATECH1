import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

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
      include: { posto: { select: { nome: true, gestorId: true } } },
    });

    const stock = await prisma.stock.update({
      where: { id: stockId },
      data: parsed.data,
      include: { produto: true },
    });

    // Gera notificação se o preço foi alterado
    if (parsed.data.preco_unitario !== undefined && stockAtual) {
      const precoAntigo = stockAtual.preco_unitario;
      const precoNovo = parsed.data.preco_unitario;
      
      const notificationContent = `O preço do ${stock.produto.nome} no posto ${stock.posto.nome} foi alterado de ${precoAntigo} Kz para ${precoNovo} Kz.`;
      
      // Cria notificação para o gestor do posto
      await prisma.notifications.create({
        data: {
          userId: stock.posto.gestorId,
          content: notificationContent,
        },
      });

      // Emite evento via Socket.IO para atualização em tempo real
      const io = (request.server as any).io;
      if (io) {
        io.to(stock.posto.gestorId.toString()).emit('nova_notificacao', {
          content: notificationContent,
          created_at: new Date(),
        });
      }
    }

    return reply.status(200).send({ stock });
  } catch (error) {
    return reply.status(404).send({ message: "Stock não encontrado." });
  }
}
