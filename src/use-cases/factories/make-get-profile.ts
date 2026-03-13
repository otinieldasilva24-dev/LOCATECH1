import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { GetUserProfileUseCase } from "../profile"


export function makeGetUserProfileUseCase (){
    
    const usersRepository = new PrismaUserRepository()
    const UseCase = new GetUserProfileUseCase(usersRepository)
    return UseCase
    
}
