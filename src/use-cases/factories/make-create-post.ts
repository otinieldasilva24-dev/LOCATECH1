
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { PrismaPostsRepository } from '@/repositories/prisma/prisma-posts-repository';
import { createPosts } from '../post';


export function makeCreatePostRepository()
{
    const postsRepository = new PrismaPostsRepository()
    const usersRepository = new PrismaUserRepository()
    const UseCase = new createPosts(postsRepository,usersRepository)
    return UseCase
}
