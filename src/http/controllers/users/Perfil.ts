
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-profile";
import { FastifyRequest,FastifyReply } from "fastify";

export async function Profile(request:FastifyRequest,reply:FastifyReply) {  
  try {
    const getUserProfile = makeGetUserProfileUseCase()

    const {user} = await getUserProfile.execute({
      userId:Number(request.user.sub)
    })
    
 
        
        return reply.status(200).send(
          user,
        )
     } catch (error:any) {
        console.log(error)
      
     }

   }




   



