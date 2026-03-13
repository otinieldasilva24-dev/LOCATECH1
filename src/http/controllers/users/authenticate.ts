
import {z} from'zod'
import { FastifyRequest,FastifyReply } from "fastify";
import { makeAuthenticateUserCase } from '@/use-cases/factories/make-authenticate';
import { invalidCredentialsError } from '@/repositories/errors/invalid-credentials';



export async function Authenticate(request:FastifyRequest,reply:FastifyReply) {
   const AuthenticateBodySchema = z.object({
       email : z.string().email(),
    })    
     console.log(request.body)
    const {email} = AuthenticateBodySchema.parse(request.body)
   try {
     const authenticateUseCase =  makeAuthenticateUserCase()
     const { user } =  await authenticateUseCase.execute({
        email
     })
   //   app.register(jwt, {
   //    secret: 'supersecret', // Substitua por uma chave secreta segura
   //  });
     const token = await reply.jwtSign(
      {
         role : user.role
      },
      {
           sub: String(user.id),   
           expiresIn:'1h'
      })
      
   const refreshToken = await reply.jwtSign(
      {
         role : user.role 

      },

      {
       
            sub:String(user.id),
            expiresIn:'7d',
         
      }
   )
      return reply
      .setCookie('refreshToken',refreshToken,{
         path : '/',
         secure:true,
         httpOnly:true,
         sameSite:'none'
     })
      .status(200)
      .send({token})

   }
    catch (error) { 

      // se o erro for uma instancia da class UserAlreadyExists
      if( error instanceof invalidCredentialsError){
         return reply.status(400).send({message : error.message })
      }
      if( error instanceof Error){

         return reply.status(409).send({message : error.message })
      }




     throw error

       
   }

   
}


