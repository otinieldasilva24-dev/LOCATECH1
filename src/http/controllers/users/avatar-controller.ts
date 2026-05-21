import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadDir = path.resolve(__dirname, "../../../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function avatarRoutes(app: FastifyInstance) {
  app.patch(
    "/me/avatar",
    { onRequest: [verifyJWT] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = await request.file();

        if (!data) {
          return reply.status(400).send({ message: "Nenhuma imagem enviada." });
        }

        const ext = path.extname(data.filename) || ".jpg";
        const uniqueName = `${randomUUID()}${ext}`;
        const filePath = path.join(uploadDir, uniqueName);

        const writeStream = fs.createWriteStream(filePath);

        await new Promise<void>((resolve, reject) => {
          data.file.on("error", reject);
          writeStream.on("error", reject);
          writeStream.on("finish", resolve);
          data.file.pipe(writeStream);
        });

        const userId = Number(request.user.sub);
        const user = await prisma.user.update({
          where: { id: userId },
          data: { image_path: uniqueName },
        });

        return reply.status(200).send({
          success: true,
          image_path: user.image_path,
          message: "Avatar atualizado com sucesso!",
        });
      } catch (error: any) {
        console.error("[Avatar] Erro:", error);
        return reply.status(500).send({
          success: false,
          message: "Erro ao atualizar avatar.",
          error: error.message,
        });
      }
    }
  );
}
