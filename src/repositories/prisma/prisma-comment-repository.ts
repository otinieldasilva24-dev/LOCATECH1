import { commenRepository } from "../prisma-comment-repository";
import { prisma } from "@/lib/prisma";


export class PrismaCommentRepository implements commenRepository{
   async create(content: string, postsId:number,userId:number){
       const comment = await prisma.comment.create({data:{content:content,postsId:postsId,userId}})
       return comment
    }

}