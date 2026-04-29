import { SavedPostoRepository } from "@/repositories/prisma/saved-posto-repository";

interface SavePostoRequest {
  userId: number;
  postoId: number;
}

interface SavePostoResponse {
  saved: boolean;
}

export class SavePostoUseCase {
  constructor(private repository: SavedPostoRepository) {}

  async execute({ userId, postoId }: SavePostoRequest): Promise<SavePostoResponse> {
    const isSaved = await this.repository.isSaved(userId, postoId);
    
    if (isSaved) {
      await this.repository.unsave(userId, postoId);
      return { saved: false };
    } else {
      await this.repository.save(userId, postoId);
      return { saved: true };
    }
  }
}

export class GetSavedPostosUseCase {
  constructor(private repository: SavedPostoRepository) {}

  async execute(userId: number) {
    const postos = await this.repository.findByUser(userId);
    return { postos };
  }
}
