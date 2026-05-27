import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";

export async function NotificationsFetchController(request: FastifyRequest, reply: FastifyReply) {
    const userId = Number(request.user?.sub);
    if (!userId) {
      return reply.status(401).send({ message: "Não autenticado." });
    }

     const notifications = await prisma.notifications.findMany({
        where: { userId },
        orderBy: { created_at: "desc" },
     });

     return reply.send({ notifications });
}