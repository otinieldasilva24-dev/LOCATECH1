import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { UpdateAvatarUseCase } from "../update-avatar-use-case"

export function makeUpdateAvatarUseCase (){
    const usersRepository = new PrismaUserRepository()
    const updateAvatarUseCase = new UpdateAvatarUseCase(usersRepository)

    return updateAvatarUseCase
}
