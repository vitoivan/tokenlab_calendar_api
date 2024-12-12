import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY } from '@/common/constants/inject-tokens';
import { UserRepository } from '../ports/user-repository';
import { UserModel } from '../models/user.model';

@Injectable()
export class DeleteUserByEmailService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<UserModel> {
    const toDelete = await this.usersRepository.getByEmail(email);

    if (!toDelete) {
      throw new NotFoundException('user not found');
    }

    return await this.usersRepository.deleteByEmail(email);
  }
}
