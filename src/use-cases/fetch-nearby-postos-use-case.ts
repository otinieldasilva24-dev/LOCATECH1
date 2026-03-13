// src/use-cases/fetch-nearby-postos-use-case.ts
import { PrismaClient, Posto } from '@prisma/client';

const prisma = new PrismaClient();

interface FetchNearbyRequest {
  userLatitude: number;
  userLongitude: number;
}

export class FetchNearbyPostosUseCase {
  async execute({ userLatitude, userLongitude }: FetchNearbyRequest) {
  
    const postos = await prisma.$queryRaw<Posto[]>`
      SELECT *, (
        6371 * acos(
          cos(radians(${userLatitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${userLongitude})) + 
          sin(radians(${userLatitude})) * sin(radians(latitude))
        )
      ) AS distance
      FROM postos
      ORDER BY distance ASC
      LIMIT 75
    `;

    return { postos };
  }
}