import { PrismaCommentRepository } from "@/repositories/prisma/prisma-comment-repository";
import { CreateCommentUseCase } from "../comment";


export function makeCommentar() {
   const commentRepository = new PrismaCommentRepository()
   const usecase = new CreateCommentUseCase(commentRepository)
   return usecase
    
}