import { NotificationRepository } from "@/repositories/notification-repository";
import { notifications } from "@prisma/client";

interface  createNoficationTypesRequest{
     userId:number
     content:string
}

interface createNotificationTypesResponse{
    notification:notifications
}

export class CreateNotificationUsecase {
       constructor(private notificationRepository: NotificationRepository){ }
       
       async execute(data:createNoficationTypesRequest):Promise<createNotificationTypesResponse>
        {
            const { content, userId } = data

            console.log("DATA RECEBIDA:", data)

            const notification = await this.notificationRepository.Create({
                userId,
                content
        }   )   
        return {
               notification
            }                                            
    }  
 }