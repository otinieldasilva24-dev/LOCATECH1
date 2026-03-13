import { PrismaMessageRepository } from "@/repositories/prisma/prisma-message-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { SendMessageUseCase } from "../send-message";



export function makeSendMessages(){
     const usersRepository =new PrismaUserRepository()
     const messageRepository = new PrismaMessageRepository()
     const usecase = new SendMessageUseCase(messageRepository,usersRepository)
     return usecase
}