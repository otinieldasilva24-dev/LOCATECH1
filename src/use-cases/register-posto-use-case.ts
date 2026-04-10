import { prisma } from "@/lib/prisma";
import { PostoType } from "@prisma/client";
import { CreateNotificationUsecase } from "./create-notification";
import { makeCreateNotification } from "./factories/make-createNotification";

// ── Input type ────────────────────────────────────────────────────────────────

export interface RegisterPostoInput {
  nome: string;
  email_institucional?: string;
  nif: string;
  tipo?: PostoType;
  endereco?: string;
  horario_funcionamento?: string;
  alvara_path?: string;
  gestorId: number;
  latitude?: number;
  longitude?: number;
}

// ── UseCase ───────────────────────────────────────────────────────────────────

export class RegisterPostoUseCase {
  async execute(data: RegisterPostoInput) {

    // 1. Verifica NIF duplicado
    const postoComMesmoNif = await prisma.posto.findUnique({
      where: { nif: data.nif },
    });

    if (postoComMesmoNif) {
      throw new Error("Já existe um posto registado com este NIF.");
    }

    // 2. Verifica coordenadas duplicadas (apenas se ambas forem fornecidas)
    if (data.latitude !== undefined && data.longitude !== undefined) {
      const postoNasCoordenadas = await prisma.posto.findFirst({
        where: {
          AND: [
            { latitude: data.latitude },
            { longitude: data.longitude },
          ],
        },
      });

      if (postoNasCoordenadas) {
        throw new Error("Já existe um posto registado nestas coordenadas.");
      }
    }

    // 3. Cria o posto
    const posto = await prisma.posto.create({
      data: {
        nome:                  data.nome,
        email_institucional:   data.email_institucional,
        nif:                   data.nif,
        tipo:                  data.tipo ?? "MISTO",
        endereco:              data.endereco,
        horario_funcionamento: data.horario_funcionamento,
        alvara_path:           data.alvara_path,
        latitude:              data.latitude,
        longitude:             data.longitude,
        gestorId:              data.gestorId,
      },
    });
   
     



    return { posto };
  }
}   