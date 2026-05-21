import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

const UpdateProfileBodySchema = z.object({
  nome: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  oldPassword: z.string().optional(),
  newPassword: z.string().min(6, "A nova palavra-passe deve ter pelo menos 6 caracteres.").optional(),
});

export async function UpdateProfile(request: FastifyRequest, reply: FastifyReply) {
  const parsed = UpdateProfileBodySchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { nome, email, phone, oldPassword, newPassword } = parsed.data;
  const userId = Number(request.user.sub);

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado." });
    }

    const dataToUpdate: Record<string, string> = {};

    if (nome) dataToUpdate.nome = nome;
    if (email) dataToUpdate.email = email;
    if (phone) dataToUpdate.phone = phone;

    if (newPassword) {
      if (!oldPassword) {
        return reply.status(400).send({ message: "A palavra-passe antiga é obrigatória para definir uma nova." });
      }

      if (user.password !== oldPassword) {
        return reply.status(401).send({ message: "A palavra-passe antiga não coincide." });
      }

      dataToUpdate.password = newPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    const { password: _, ...userSemPassword } = updatedUser as any;

    return reply.status(200).send(userSemPassword);
  } catch (error) {
    console.error('[UpdateProfile] Erro:', error);
    return reply.status(500).send({ message: "Erro interno ao atualizar perfil." });
  }
}
