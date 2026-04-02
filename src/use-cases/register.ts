// import { hash } from "bcryptjs";
import { UserAreadyExistsError } from "@/repositories/errors/user-already-exists-error";
import { usersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────

interface RegisterUseCaseRequest {
  nome:       string;
  email:      string;
  password:   string;
  phone?:     string;
  image_path?: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

// ── UseCase ───────────────────────────────────────────────────────────────────

export class RegisterUseCase {
  constructor(private usersRepository: usersRepository) {}

  async Execute({
    nome,
    email,
    password,
    phone,
    image_path,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {

    // 1. Verifica e-mail duplicado
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAreadyExistsError();
    }

    // 2. Hash da palavra-passe
    const password_hash = password

    // 3. Cria o utilizador
    const user = await this.usersRepository.Create({
      nome,
      email,
      password: password_hash,
      phone,
      image_path,
    });

    return { user };
  }
}