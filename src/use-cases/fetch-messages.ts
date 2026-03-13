import { messageRepository } from "@/repositories/message-repository"
import { usersRepository } from "@/repositories/users-repository"
import { messages } from "@prisma/client"

interface SendMessageResponse{
    message:messages[]
}

export class LisMessageUseCase {
     constructor(
        private  messageRepository:messageRepository,
    ){}
    async execute():Promise<SendMessageResponse>{
         const message = await this.messageRepository.list()
          return {
            message
          }
    }

}