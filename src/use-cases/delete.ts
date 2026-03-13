import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { usersRepository } from "@/repositories/users-repository";
import { io } from "@/server";

interface DeleteUserRequestParams {
     id:number
}

export class DeleteUserUseCase {

     constructor(
          private usersRepository:usersRepository,

     ){}
     async execute({id}:DeleteUserRequestParams):Promise<null>{
     
           const user = await this.usersRepository.findById(id)
           if(!user){
             throw new resourceNotFoundError()
           }
          

           await this.usersRepository.delete(id)
           return null
     }

}