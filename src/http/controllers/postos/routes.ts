import { FastifyInstance } from "fastify";
import { RegisterPosto } from "./register-posto-controller";
import { UpdatePostoController } from "./update-posto-controller";
import { FetchPostoByIdController } from "./fetch-posto-by-id-controller";
import { FetchNearbyPostosController, FetchNearbyPostosControllerV2 } from "./filter-nearby-controller";
import { upload } from "@/utills/multer";
import { FetchAllPostosController } from "./fetch-all-postos-controller";
import { NotificationsFetchController } from "./notifications-fetch-controller";
import { verifyJWT, verifyUserRole } from "../middleware/verify-jwt";

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
     app.get('/notif', NotificationsFetchController);
     
     // Atualizar posto (apenas GESTOR ou ADMIN)
     app.patch('/postos/:id', { 
         preHandler: [verifyJWT, verifyUserRole(['GESTOR', 'ADMIN'])] 
     }, UpdatePostoController);
}