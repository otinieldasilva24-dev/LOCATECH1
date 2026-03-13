
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { FetchUsersUseCase } from '../fetch-users';


export function makeFetchUsersRepository(){
    
    const usersRepository = new PrismaUserRepository()
    const UseCase = new FetchUsersUseCase(usersRepository)
    return UseCase
    
}
