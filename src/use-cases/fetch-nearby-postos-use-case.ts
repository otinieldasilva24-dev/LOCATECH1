// src/use-cases/fetch-nearby-postos-use-case.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FetchNearbyRequest {
  userLatitude: number;
  userLongitude: number;
}


interface PostoWithPrices {
  id: number;
  nome: string;
  tipo: string;
  latitude: number;
  longitude: number;
  endereco: string | null;
  distance: number;
  // Aqui virão os produtos agregados como JSON
  produtos: {
    nome: string;
    preco: number;
    unidade: string;
    quantidade: number;
  }[];
}

export class FetchNearbyPostosUseCase {
  async execute({ userLatitude, userLongitude }: FetchNearbyRequest) {
    
    // Usamos JSON_AGG para criar um array de objetos de produtos para cada posto
    const postos = await prisma.$queryRaw<PostoWithPrices[]>`
      SELECT 
        p.*, 
        (
          6371 * acos(
            cos(radians(${userLatitude})) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(${userLongitude})) + 
            sin(radians(${userLatitude})) * sin(radians(p.latitude))
          )
        ) AS distance,
        COALESCE(
          (
            SELECT json_agg(json_build_object(
              'nome', prod.nome,
              'preco', s.preco_unitario,
              'unidade', prod.unidade_medida,
              'quantidade', s.quantidade_atual
            ))
            FROM stocks s
            JOIN produtos prod ON s."produtoId" = prod.id
            WHERE s."postoId" = p.id
          ), 
          '[]'
        ) AS produtos
      FROM postos p
      ORDER BY distance ASC
      LIMIT 75
    `;

    return { postos };
  }
}