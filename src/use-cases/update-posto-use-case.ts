import { prisma } from "@/lib/prisma";
import { PostoType } from "@prisma/client";

export interface UpdatePostoInput {
  id: number;
  nome?: string;
  email_institucional?: string;
  nif?: string;
  tipo?: PostoType;
  endereco?: string;
  horario_funcionamento?: string;
  latitude?: number;
  longitude?: number;
  alvara_path?: string;
}

export class UpdatePostoUseCase {
  async execute(data: UpdatePostoInput) {
    const { id, ...updateData } = data;

    // Verifica se o posto existe
    const postoExistente = await prisma.posto.findUnique({
      where: { id },
    });

    if (!postoExistente) {
      throw new Error("Posto não encontrado.");
    }

    // Se estiver atualizando NIF, verifica duplicidade
    if (updateData.nif && updateData.nif !== postoExistente.nif) {
      const nifDuplicado = await prisma.posto.findUnique({
        where: { nif: updateData.nif },
      });

      if (nifDuplicado) {
        throw new Error("Já existe um posto com este NIF.");
      }
    }

    // Atualiza o posto
    const posto = await prisma.posto.update({
      where: { id },
      data: updateData,
    });

    return { posto };
  }
}
