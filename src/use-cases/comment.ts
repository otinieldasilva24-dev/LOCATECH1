import { commenRepository } from "@/repositories/prisma-comment-repository";

interface CreateCommentUseCaseRequest {
  content: string;
  postsId: number;
  userId:number
}

export class CreateCommentUseCase {
  constructor(private commentRepository: commenRepository) {}

  async execute({ content, postsId ,userId}: CreateCommentUseCaseRequest) {
    const comment = await this.commentRepository.create(content, postsId,userId);
    return { comment };
  }
}
