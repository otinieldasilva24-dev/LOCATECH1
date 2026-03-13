
import { z } from 'zod';
import { PostoType } from '@prisma/client';

export const registerPostoSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  tipo: z.nativeEnum(PostoType, {
    errorMap: () => ({ message: "Tipo deve ser COMBUSTIVEL, GAS ou MISTO" })
  }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  endereco: z.string().optional(),
});

// Criamos um tipo TypeScript automaticamente a partir do schema
export type RegisterPostoInput = z.infer<typeof registerPostoSchema>;