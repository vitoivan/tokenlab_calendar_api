import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY } from '@/common/constants/inject-tokens';
import { UserRepository } from '../ports/user-repository';
import { UserModel } from '../models/user.model';

@Injectable()
export class GetUserByIdService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UserRepository,
  ) {}

  async execute(id: number): Promise<UserModel> {
    const user = await this.usersRepository.getById(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
