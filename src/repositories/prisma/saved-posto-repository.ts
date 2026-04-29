import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class SavedPostoRepository {
  // Salvar um posto
  async save(userId: number, postoId: number) {
    return prisma.savedPosto.create({
      data: {
        userId,
        postoId,
      },
    });
  }

  // Remover um posto salvo
  async unsave(userId: number, postoId: number) {
    return prisma.savedPosto.delete({
      where: {
        userId_postoId: {
          userId,
          postoId,
        },
      },
    });
  }

  // Listar postos salvos de um usuário
  async findByUser(userId: number) {
    const saved = await prisma.savedPosto.findMany({
      where: { userId },
      include: {
        posto: {
          include: {
            stocks: {
              include: {
                produto: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
    
    return saved.map(s => s.posto);
  }

  // Verificar se um posto está salvo
  async isSaved(userId: number, postoId: number): Promise<boolean> {
    const saved = await prisma.savedPosto.findUnique({
      where: {
        userId_postoId: {
          userId,
          postoId,
        },
      },
    });
    return !!saved;
  }
}
