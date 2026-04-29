import { FastifyInstance } from "fastify";
import { toggleSavePosto, getSavedPostos } from "./saved-posto-controller";
import { verifyJWT } from "../middleware/verify-jwt";

export async function SavedPostosRoutes(app: FastifyInstance) {
  // Alternar favorito (salvar/remover)
  app.post('/saved-postos/:postoId', { preHandler: [verifyJWT] }, toggleSavePosto);

  // Listar favoritos
  app.get('/saved-postos', { preHandler: [verifyJWT] }, getSavedPostos);
}
