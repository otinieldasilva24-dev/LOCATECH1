import { prisma } from "@/lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";



export async function NotificationsFetchController(request: FastifyRequest, reply: FastifyReply) {
   
    const userId =  1

     const notifications = await  prisma.notifications.findMany({
        where:{
            userId      
        }})

     return reply.send({ notifications })

}      