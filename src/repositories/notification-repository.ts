
import { Prisma,User, notifications } from "@prisma/client";
  export interface createNotificationDTO { 
      userId: number;
      content: string;
  }



export interface NotificationRepository {
Create(data : createNotificationDTO) : Promise<notifications>
}
