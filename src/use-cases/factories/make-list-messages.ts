import { PrismaMessageRepository } from "@/repositories/prisma/prisma-message-repository";
import { LisMessageUseCase } from "../fetch-messages";



export function makeListMessages(){
     const messageRepository = new PrismaMessageRepository()
     const usecase = new LisMessageUseCase(messageRepository)
     return usecase
}