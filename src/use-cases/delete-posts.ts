import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { postssRepository } from "@/repositories/posts-repository";
import { usersRepository } from "@/repositories/users-repository";


interface FetchPostsPropsRequest{
    userId:number
    postId:number
}

export class DeletePosts {
     constructor(
        private postsRepository:postssRepository,
        private usersRepository:usersRepository
    ){}
     async execute({userId,postId}:FetchPostsPropsRequest){
         const user = await this.usersRepository.findById(userId)
         if(!user){
             throw new resourceNotFoundError()
         }
              await this.postsRepository.delete(postId)
        
        
        return null
     }
}