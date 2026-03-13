import { AuthenticateUseCase } from '../authenticate';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';


export function  makeAuthenticateUserCase(){
    const usersRepository = new PrismaUserRepository()
    const UseCase = new AuthenticateUseCase(usersRepository)
    return UseCase
}