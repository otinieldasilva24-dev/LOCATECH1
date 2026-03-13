import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { filterPostoSchema } from './filter-posto-schema';
import { FetchNearbyPostosUseCase } from '@/use-cases/fetch-nearby-postos-use-case';

export class FetchNearbyPostosController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { latitude, longitude } = filterPostoSchema.parse(request.query);

      const fetchNearbyPostosUseCase = new FetchNearbyPostosUseCase();
      const { postos } = await fetchNearbyPostosUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
      });

      return reply.status(200).send(postos);

    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ 
          message: "Coordenadas inválidas", 
          errors: err.flatten().fieldErrors 
        });
      }
      
      return reply.status(500).send({ message: "Erro interno no servidor." });
    }
  }
}