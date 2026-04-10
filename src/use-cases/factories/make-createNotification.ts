import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { RegisterUseCase } from "../register"
import { PrismaNotificationRepository } from "@/repositories/prisma/prisma-notification-repository"
import { CreateNotificationUsecase } from "../create-notification"



export function makeCreateNotification(){
    
    const notificationRepository = new PrismaNotificationRepository()
    const usecase  = new CreateNotificationUsecase(notificationRepository)

    return usecase
}