import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { postssRepository } from "@/repositories/posts-repository";
import { usersRepository } from "@/repositories/users-repository";


interface ReactPostsPropsRequest{
    userId:number
    postId:number
    react:number
}

export class ReactPosts {
     constructor(
        private postsRepository:postssRepository,
        private usersRepository:usersRepository
    ){}
     async execute({userId,postId,react}:ReactPostsPropsRequest){
        const user = await this.usersRepository.findById(userId)
        if(!user){
             throw new resourceNotFoundError()
        }
        const Post = await this.postsRepository.react(userId, postId, react)
        return {
            Post
        }
     }
}