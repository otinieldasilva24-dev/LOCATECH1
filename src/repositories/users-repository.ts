
import { Prisma,User } from "@prisma/client";

interface users {
    id: string;
    nome: string;
    email: string;
    status_energy: boolean;
}[]

export interface usersRepository {
    findById(id : number): Promise <User | null> 
    delete(id:number):Promise<null>
    findByEmail( email : string) : Promise <User | null>  //devolvendo uma promise
    Create(data : Prisma.UserCreateInput) : Promise<User>
    fetchUsers():Promise<User[]>
}
