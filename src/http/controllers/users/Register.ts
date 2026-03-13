
import {z} from'zod'
import { FastifyRequest,FastifyReply } from "fastify";
import { io } from '@/server';
import { UserAreadyExistsError } from '@/repositories/errors/user-already-exists-error';
import { makeRegisterUserCase } from '@/use-cases/factories/make-register-user';

export async function Register(request:FastifyRequest,reply:FastifyReply) {    
    const RegisterBodySchema = z.object({
       nome : z.string(),
       email : z.string().email(),
       phone:z.coerce.string().optional(),
    })
    console.log(request.body)
   const {nome,email,phone} = RegisterBodySchema.parse(request.body)
   try {

       const image = (request as any).file
       const  image_path = image.filename

 
         if (!image) {
    return reply.status(400).send({ message: 'Imagem não enviada' })
  }

  

      const registerUseCase = makeRegisterUserCase()
      console.log(image_path)

      const {user} = await registerUseCase.Execute({
        image_path:image_path,
        nome,
        email,
        phone
     })
   //   io.emit("users", user)

      return reply.status(201).send({user})
   }
    catch (error) { 
      if( error instanceof UserAreadyExistsError){
         return reply.status(409).send({message :error.message,})
      }
      throw error
       
   }
   
}


