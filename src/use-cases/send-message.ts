import { resourceNotFoundError } from "@/repositories/errors/resource-not-found"
import { messageRepository } from "@/repositories/message-repository"
import { usersRepository } from "@/repositories/users-repository"
import { messages } from "@prisma/client"

interface SendMessageRequest{
    content:string
    userId:number
}

interface SendMessageResponse{
    message:messages
}

export class SendMessageUseCase {
     constructor(
        private  messageRepository:messageRepository,
        private usersRepository:usersRepository
    ){}
    async execute({content,userId}:SendMessageRequest):Promise<SendMessageResponse>{
         const user = await this.usersRepository.findById(userId)
         if(!user){
            throw new resourceNotFoundError()
         }

         const message = await this.messageRepository.send(content,userId)

          return {
            message
          }
    }

}