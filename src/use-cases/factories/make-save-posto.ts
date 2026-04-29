import { SavedPostoRepository } from "@/repositories/prisma/saved-posto-repository";
import { SavePostoUseCase } from "../saved-posto-use-case";

export function makeSavePostoUseCase() {
  const repository = new SavedPostoRepository();
  return new SavePostoUseCase(repository);
}
