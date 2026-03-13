import { usersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";


interface FetchUsersResponse {
    users:User[]
}

export class FetchUsersUseCase {
     constructor (private usersRepository :usersRepository){}
     async execute():Promise<FetchUsersResponse>{
         const users = await this.usersRepository.fetchUsers()
        return{
            users
        }
     }
}