// src/http/controllers/fetch-all-postos-controller.ts
import { FastifyRequest, FastifyReply} from 'fastify';
import { FetchAllPostosUseCase } from '@/use-cases/fetch-all-postos-use-case';

export class FetchAllPostosController {
  async handle(request:FastifyRequest, response: FastifyReply) {
    try {
      const fetchAllPostosUseCase = new FetchAllPostosUseCase();

      const { postos } = await fetchAllPostosUseCase.execute();

      return response.send({ postos });
    } catch (err) {

      return response.status(500).send({ message: 'Internal server error.' });
    }
  }
}