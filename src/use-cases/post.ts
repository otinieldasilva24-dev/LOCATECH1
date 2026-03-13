import { resourceNotFoundError } from "@/repositories/errors/resource-not-found";
import { postssRepository } from "@/repositories/posts-repository";
import { usersRepository } from "@/repositories/users-repository";
import { Posts } from "@prisma/client";


interface CreatePostsPropsResponse {
    Post:Posts
}
interface CreatePostsPropsRequest{
    userId:number
    image_path:string|null
    content:string
}

export class createPosts {
     constructor(
        private postsRepository:postssRepository,
        private usersRepository:usersRepository
    ){}
     async execute({userId,content,image_path}:CreatePostsPropsRequest):Promise<CreatePostsPropsResponse>{
        const user = await this.usersRepository.findById(userId)
        if(!user){
             throw new resourceNotFoundError()
        }
        const Post = await this.postsRepository.Create({
            content:content,
            image_path:image_path,
            users:{
                connect:{
                    id:userId
                }
            }
        })
        return {
            Post
        }
     }
}