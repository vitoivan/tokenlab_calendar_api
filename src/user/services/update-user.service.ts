import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../ports/user-repository';
import { UserModel } from '../models/user.model';
import { hash } from 'bcrypt';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { USERS_REPOSITORY } from '@/common/constants/inject-tokens';

@Injectable()
export class UpdateUserService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UserRepository,
  ) {}

  async execute(id: number, dto: UpdateUserDTO): Promise<UserModel> {
    const userFound = await this.usersRepository.getByEmail(dto.email);

    if (userFound) {
      throw new ConflictException('user with this email already exists');
    }

    const toUpdate = await this.usersRepository.getById(id);

    if (!toUpdate) {
      throw new NotFoundException('user not found');
    }

    if (dto.name) {
      toUpdate.name = dto.name;
    }

    if (dto.email) {
      toUpdate.email = dto.email;
    }

    if (dto.password) {
      toUpdate.password = await hash(dto.password, 10);
    }

    return await this.usersRepository.update(toUpdate);
  }
}
