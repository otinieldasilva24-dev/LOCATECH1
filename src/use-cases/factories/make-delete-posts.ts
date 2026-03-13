
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { PrismaPostsRepository } from '@/repositories/prisma/prisma-posts-repository';
import { DeletePosts } from '../delete-posts';


export function makeDeletePostRepository(){
    
    const postsRepository = new PrismaPostsRepository()
    const usersRepository = new PrismaUserRepository()
    const UseCase = new DeletePosts(postsRepository,usersRepository)
    return UseCase
    
}
