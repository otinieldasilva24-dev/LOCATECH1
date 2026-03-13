import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { postssRepository } from "@/repositories/posts-repository";
import { usersRepository } from "@/repositories/users-repository";
import { Posts } from "@prisma/client";


interface FetchPostsPropsResponse {
    Posts:Posts[]
}
interface FetchPostsPropsRequest{
    query?:string|undefined
}

export class FetchPosts {
     constructor(
        private postsRepository:postssRepository,
    ){}
     async execute({query}:FetchPostsPropsRequest):Promise<FetchPostsPropsResponse>{

        const Posts = await this.postsRepository.fetchPosts(query)
        
        
        return {
            Posts 
        }
     }
}