import { FastifyInstance } from "fastify";
import { RegisterPostosController } from "./register-posto-controller";
import { FetchNearbyPostosController } from "./filter-nearby-controller";

export async function PostosRoutes(app:FastifyInstance) {
     app.post("/postos",RegisterPostosController)
     const fetchNearbyController = new FetchNearbyPostosController();
     app.get('/proximos', fetchNearbyController.handle);
}