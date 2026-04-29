import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { makeUpdateAvatarUseCase } from "@/use-cases/factories/make-update-avatar";
import { upload } from "@/utills/multer";

export async function avatarRoutes(app: FastifyInstance) {
  app.patch(
    "/me/avatar",
    { preHandler: [verifyJWT] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // 1. Processa o upload via multer
      await new Promise<void>((resolve, reject) => {
        upload.single("image")(request.raw as any, reply.raw as any, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // 2. Valida presença do arquivo
      const file = (request as any).file;
      if (!file) {
        return reply.status(400).send({ message: "Nenhuma imagem enviada." });
      }

      const userId = Number(request.user.sub);

      // 3. Executa o caso de uso (única responsável pela atualização)
      try {
        const useCase = makeUpdateAvatarUseCase();
        const { image_path } = await useCase.execute({
          userId,
          image_path: file.filename,
        });

        return reply.status(200).send({
          success: true,
          image_path,
          message: "Avatar atualizado com sucesso!",
        });
      } catch (error: any) {
        console.error("[Avatar] Erro ao atualizar avatar:", error);
        return reply.status(500).send({
          success: false,
          message: "Erro ao atualizar avatar.",
          error: error.message,
        });
      }
    }
  );
}
