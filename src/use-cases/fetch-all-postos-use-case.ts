import { prisma } from "@/lib/prisma";



export class FetchAllPostosUseCase {
  async execute() {
    const postos = await prisma.posto.findMany({
      include: {
        stocks: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });

    // Mapeamos para manter o formato de "produtos" que você definiu no outro Use Case
    const postosFormatted = postos.map((posto) => ({
      id: posto.id,
      nome: posto.nome,
      tipo: posto.tipo,
      latitude: posto.latitude,
      longitude: posto.longitude,
      endereco: posto.endereco,
      produtos: posto.stocks.map((s) => ({
        nome: s.produto.nome,
        preco: s.preco_unitario,
        unidade: s.produto.unidade_medida,
        quantidade: s.quantidade_atual,
      })),
    }));

    return { postos: postosFormatted };
  }
}