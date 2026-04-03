import { FastifyInstance } from "fastify";
import { RegisterPosto } from "./register-posto-controller";
import { FetchNearbyPostosController } from "./filter-nearby-controller";
import { upload } from "@/utills/multer";
import { FetchAllPostosController } from "./fetch-all-postos-controller";

export async function PostosRoutes(app:FastifyInstance) {
    app.post("/postos", async (request, reply) => {
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
     const fetchAllPostosController = new FetchAllPostosController();


// Rota para todos os postos
     app.get('/postos', fetchAllPostosController.handle);
     app.get('/proximos', fetchNearbyController.handle);
}