import { UserRepository } from "@/repositories/users-repository";
import { Prisma } from "@prisma/client";

interface UpdateAvatarRequest {
  userId: number;
  image_path: string;
}

export class UpdateAvatarUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({ userId, image_path }: UpdateAvatarRequest) {
    const user = await this.usersRepository.updateAvatar(userId, image_path);
    return { image_path: user.image_path };
  }
}
