import { RegisterPostoInput } from "@/http/controllers/postos/postos-controller.type";
import { prisma } from "@/lib/prisma";



export class RegisterPostoUseCase {
  async execute(data: RegisterPostoInput) {
    // Validação de unicidade no banco
    const postoExistente = await prisma.posto.findFirst({
      where: {
        AND: [
          { latitude: data.latitude },
          { longitude: data.longitude }
        ]
      },
    });

    if (postoExistente) {
      throw new Error("Já existe um posto registrado nestas coordenadas.");
    }

    const posto = await prisma.posto.create({
      data
    });

    return { posto };
  }
}