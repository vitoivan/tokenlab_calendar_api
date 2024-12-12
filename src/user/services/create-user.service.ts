import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { USERS_REPOSITORY } from '@/common/constants/inject-tokens';
import { UserRepository } from '../ports/user-repository';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserModel } from '../models/user.model';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserModel> {
    const userFound = await this.usersRepository.getByEmail(dto.email);

    if (userFound) {
      throw new ConflictException('user already exists');
    }

    const hashedPassword = await hash(dto.password, 10);

    const toCreate = new UserModel({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    return await this.usersRepository.create(toCreate);
  }
}
