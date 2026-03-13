
import { PrismaPostsRepository } from '@/repositories/prisma/prisma-posts-repository';
import { FetchPosts } from '../fetch-posts';


export function makeFetchPostRepository(){
    const postsRepository = new PrismaPostsRepository()
    const UseCase = new  FetchPosts(postsRepository)
    return UseCase
}
