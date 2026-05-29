import { prisma } from "@/lib/prisma";

export class DeletePostoUseCase {
  async execute(id: number) {
    const posto = await prisma.posto.findUnique({
      where: { id },
    });

    if (!posto) {
      throw new Error("Posto não encontrado.");
    }

    await prisma.stock.deleteMany({
      where: { postoId: id },
    });

    await prisma.savedPosto.deleteMany({
      where: { postoId: id },
    });

    await prisma.posto.delete({
      where: { id },
    });

    return { deleted: true };
  }
}
