import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

const RegisterPostoSchema = z.object({
  nome:                   z.string(),
  email_institucional:    z.string().email().optional(),
  nif:                    z.string(),
  tipo:                   z.enum(["COMBUSTIVEL", "GAS", "MISTO"]).default("MISTO"),
  endereco:               z.string().optional(),
  horario_funcionamento:  z.string().optional(),
  gestorId:               z.coerce.number(),
  latitude:               z.coerce.number().optional(),
  longitude:              z.coerce.number().optional(),
});

export async function RegisterPosto(request: FastifyRequest, reply: FastifyReply) {
    console.log("BODY:", request.body)
  console.log("FILE:", (request as any).file)
  console.log("RAW BODY:", (request.raw as any).body)

  // const parsed = RegisterPostoSchema.safeParse(request.body);
  const parsed = RegisterPostoSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const file = (request as any).file;
  const alvara_path: string | undefined = file?.filename;
  console.log(parsed)

  // Verifica se NIF já existe
  const postoExistente = await prisma.posto.findUnique({
    where: { nif: parsed.data.nif },
  });

  if (postoExistente) {
    return reply.status(409).send({ message: "Já existe um posto com este NIF." });
  }
  const posto = await prisma.posto.create({
    data: {
      ...parsed.data,
      alvara_path,
    },
  });

  return reply.status(201).send({ posto });
}