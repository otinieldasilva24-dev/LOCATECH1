import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { RegisterPosto } from "./register-posto-controller";
import { UpdatePostoController } from "./update-posto-controller";
import { FetchPostoByIdController } from "./fetch-posto-by-id-controller";
import { FetchNearbyPostosController, FetchNearbyPostosControllerV2 } from "./filter-nearby-controller";
import { upload } from "@/utills/multer";
import { FetchAllPostosController } from "./fetch-all-postos-controller";
import { NotificationsFetchController } from "./notifications-fetch-controller";
import { verifyJWT, verifyUserRole } from "../middleware/verify-jwt";
import { prisma } from "@/lib/prisma";

export async function PostosRoutes(app:FastifyInstance) {
    // Apenas GESTOR e ADMIN podem cadastrar novos postos
    app.post("/postos", { 
        preHandler: [verifyJWT, verifyUserRole(['GESTOR', 'ADMIN'])] 
    }, async (request, reply) => {
    await new Promise<void>((resolve, reject) => {
      const middleware = upload.single("alvara");
      middleware(request.raw as any, reply.raw as any, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
 
    request.body = (request.raw as any).body;
    (request as any).file = (request.raw as any).file;
 
    return RegisterPosto(request, reply);
  });

     const fetchNearbyController = new FetchNearbyPostosController();
     const fetchNearbyControllerV2 = new FetchNearbyPostosControllerV2();
     const fetchAllPostosController = new FetchAllPostosController();


// Rota para todos os postos
     app.get('/postos', fetchAllPostosController.handle);
     app.get('/postos/:id', FetchPostoByIdController);
     app.get('/postos/nearby', fetchNearbyControllerV2.handle);
     app.get('/proximos', fetchNearbyController.handle);
      app.get('/notif', { preHandler: [verifyJWT] }, NotificationsFetchController);

     // Lista apenas os postos do gestor logado
     app.get('/postos/meus', {
       preHandler: [verifyJWT, verifyUserRole(['GESTOR', 'ADMIN'])]
     }, async (request: FastifyRequest, reply: FastifyReply) => {
       const userId = request.user?.sub as number;
       const postos = await prisma.posto.findMany({
         where: { gestorId: userId },
         include: {
           stocks: { include: { produto: true } },
         },
         orderBy: { nome: 'asc' },
       });

       const postosFormatted = postos.map((posto) => ({
         id: posto.id,
         nome: posto.nome,
         tipo: posto.tipo,
         latitude: posto.latitude,
         longitude: posto.longitude,
         endereco: posto.endereco,
         horario_funcionamento: posto.horario_funcionamento,
         produtos: posto.stocks.map((s) => ({
           id: s.id,
           nome: s.produto.nome,
           preco: s.preco_unitario,
           quantidade: s.quantidade_atual,
           produtoId: s.produtoId,
         })),
       }));

       return reply.status(200).send({ postos: postosFormatted });
     });
     
     // Atualizar posto (apenas GESTOR ou ADMIN)
     app.patch('/postos/:id', { 
         preHandler: [verifyJWT, verifyUserRole(['GESTOR', 'ADMIN'])] 
     }, UpdatePostoController);
}