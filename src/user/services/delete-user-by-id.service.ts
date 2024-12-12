import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../ports/user-repository';
import { UserModel } from '../models/user.model';
import { USERS_REPOSITORY } from '@/common/constants/inject-tokens';

@Injectable()
export class DeleteUserByIdService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UserRepository,
  ) {}

  async execute(id: number): Promise<UserModel> {
    const toDelete = await this.usersRepository.getById(id);

    if (!toDelete) {
      throw new NotFoundException('user not found');
    }

    return await this.usersRepository.deleteById(id);
  }
}
