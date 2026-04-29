import { SavedPostoRepository } from "@/repositories/prisma/saved-posto-repository";
import { GetSavedPostosUseCase } from "../saved-posto-use-case";

export function makeGetSavedPostosUseCase() {
  const repository = new SavedPostoRepository();
  return new GetSavedPostosUseCase(repository);
}
