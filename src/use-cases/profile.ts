import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { usersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";


interface GetUserProfileUseCaseRequest{
    userId : number
}

interface  GetUserProfileUseCaseResponse {
   user: User
}


export class GetUserProfileUseCase{

    constructor(private usersRespository : usersRepository){}

    async execute
    ({userId} : GetUserProfileUseCaseRequest) : Promise<GetUserProfileUseCaseResponse>{
 
        const user = await this.usersRespository.findById(userId)

        if(!user){
           throw new resourceNotFoundError()
        }


        return {
            user,
        }


      
    }


    
}