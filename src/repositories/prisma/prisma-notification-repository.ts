import { prisma } from "@/lib/prisma"
import { notifications } from "@prisma/client"
import { createNotificationDTO, NotificationRepository } from "../notification-repository"



export class PrismaNotificationRepository implements NotificationRepository {
    async Create(data: createNotificationDTO){
        const notification = await prisma.notifications.create({
            data: {
                userId: data.userId,
                content: data.content
            }
        })
        return notification
    }   
}