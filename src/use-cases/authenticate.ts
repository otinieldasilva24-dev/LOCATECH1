import { invalidCredentialsError } from "@/repositories/errors/invalid-credentials";
import { usersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
 

interface AuthenticateUseCaseRequest{
    email: string,
}

interface  AuthenticateUseCaseResponse {
    user: User
}


export class AuthenticateUseCase{
    constructor(private usersRespository : usersRepository){}
    async execute
        ({email} : AuthenticateUseCaseRequest) : Promise<AuthenticateUseCaseResponse>{
        const user = await this.usersRespository.findByEmail(email)
        if(!user){
           throw new invalidCredentialsError()
        }
        return {
            user,
        }
    }
}