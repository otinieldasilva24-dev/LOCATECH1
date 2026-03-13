import { messages } from "@prisma/client";



export interface MessagesOffRepository{

    sendMessage(content:string,senderId:number,receiverId:number):Promise<messages>
    FindAllMessage(query?:string):Promise<messages[]>
    FindMessageUnique(Id:string):Promise<messages | null>
    MessagesAmount(userId:string):Promise<number>
    DeleteMessages(Id:string):Promise<null>


}