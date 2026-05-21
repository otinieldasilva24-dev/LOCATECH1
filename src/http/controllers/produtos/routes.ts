import { FastifyInstance } from 'fastify';
import { FetchProdutosController } from './fetch-produtos-controller';

export async function ProdutosRoutes(app: FastifyInstance) {
  app.get('/produtos', FetchProdutosController);
}
