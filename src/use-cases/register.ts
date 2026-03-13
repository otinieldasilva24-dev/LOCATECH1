import { UserAreadyExistsError } from "@/repositories/errors/user-already-exists-error";
import { usersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";


interface  RegisterUseCaseRequest{
    nome:string;
    phone:string|undefined
    image_path:string|undefined
    email:string;
}
interface RegisterUseCaseResponse{
    user:User
}
export class RegisterUseCase {
    constructor( private usersRepository : usersRepository ) { }
 async Execute({nome,email,image_path,phone} : RegisterUseCaseRequest)
 : Promise<RegisterUseCaseResponse>
{


     const userWithSameEmail = await this.usersRepository.findByEmail(email)
 

  if(userWithSameEmail){
    throw new UserAreadyExistsError()
    
  }
   const user = await this.usersRepository.Create({
       nome,
       email,
       phone,
       image_path
         
   })
   
   return {
    user
   }
  } 

}

