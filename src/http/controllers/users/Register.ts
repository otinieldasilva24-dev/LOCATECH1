import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserAreadyExistsError } from "@/repositories/errors/user-already-exists-error";
import { makeRegisterUserCase } from "@/use-cases/factories/make-register-user";

const RegisterBodySchema = z.object({
  nome:     z.string(),
  email:    z.string().email(),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres.").optional(),
  phone:    z.coerce.string().optional(),
  role:     z.enum(["MEMBER", "ADMIN", "GESTOR"]).optional(),
});

export async function Register(request: FastifyRequest, reply: FastifyReply) {
  // Sanitiza espaços nos nomes dos campos
  const rawBody = request.body as Record<string, any>;
  const cleanBody = Object.fromEntries(
    Object.entries(rawBody).map(([k, v]) => [k.trim(), v])
  );


  console.log(request.body)

  const parsed = RegisterBodySchema.safeParse(cleanBody);

  if (!parsed.success) {
    return reply.status(400).send({
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { nome, email, password, phone, role } = parsed.data;

  // Imagem é opcional
  const image      = (request as any).file;
  const image_path = image?.filename;

  try {
    const registerUseCase = makeRegisterUserCase();

    const { user } = await registerUseCase.Execute({
      nome,
      email,
      password,
      phone,
      image_path,
      role,
    });

    // Nunca devolve a password no response
    const { password: _, ...userSemPassword } = user as any;

    return reply.status(201).send({ user: userSemPassword });

  } catch (error) {
    if (error instanceof UserAreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}