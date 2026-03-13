import { messages } from "@prisma/client";
import { messageRepository } from "../message-repository";
import { prisma } from "@/lib/prisma";
import { io } from "@/server";


export class PrismaMessageRepository implements messageRepository{
    async send(content: string, userId: number){
         const message = await prisma.messages.create({
            data:{
                content,
                isMe:true,
                userId
            }
         })
         const messages = await prisma.messages.findMany({
            include:{
                user:{
                    select:{
                        email:true,
                        nome:true,
                        image_path:true,
                        role:true
                    }
                }
            },orderBy:{
                created_at:'desc'
            }
         })
          io.emit("messages", messages)

      return message
    }
   async list() {
           const messages = await prisma.messages.findMany({
            include:{
                user:{
                    select:{
                        email:true,
                        nome:true,
                        image_path:true,
                        role:true
                    }
                }
            },orderBy:{
                created_at:'asc'
            }
         })
                return messages

    }

}