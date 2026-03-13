
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { PrismaPostsRepository } from '@/repositories/prisma/prisma-posts-repository';
import { ReactPosts } from '../react-posts';


export function makeReactPostRepository(){
    
    const postsRepository = new PrismaPostsRepository()
    const usersRepository = new PrismaUserRepository()
    const UseCase = new ReactPosts(postsRepository,usersRepository)
    return UseCase
    
}
