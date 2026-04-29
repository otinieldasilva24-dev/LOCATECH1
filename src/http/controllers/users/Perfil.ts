
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-profile";
import { FastifyRequest,FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

export async function Profile(request:FastifyRequest,reply:FastifyReply) {  
  try {
    // Busca direto no Prisma para debug
    const userId = Number(request.user.sub);
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    console.log('[Perfil] User encontrado:', user?.id, '| image_path:', user?.image_path);
    
    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado" });
    }
    
    return reply.status(200).send(user);
  } catch (error:any) {
    console.error('[Perfil] Erro:', error);
    return reply.status(500).send({ message: "Erro interno" });
  }
}




   



