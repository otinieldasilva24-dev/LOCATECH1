import { User, Prisma } from "@prisma/client";
import { usersRepository } from "../users-repository";
import { prisma } from "@/lib/prisma";

export class PrismaUserRepository implements usersRepository{
       async findById(id: number) {
        const user = await prisma.user.findUnique({
           where: {
               id
           },include:{
            
            messages:true
           }
       })
       await prisma.user.update({
        where:{
             id:id
        },
        data:{
            isAlive:true
        }
       })

      return user

   }    
     async delete(id: number){
           await prisma.user.delete({
             where:{
                id
             }
           })
           return null
    }

  async findByEmail(email: string) {
         const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
       return user
    }
    
  async Create(data : Prisma.UserCreateInput){
    console.log(data)
   const user =  await prisma.user.create({
             data,  
  })



  return user

    }

 async fetchUsers(){
         const users  = await prisma.user.findMany()
         return users
    }
      
}