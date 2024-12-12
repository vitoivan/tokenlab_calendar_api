import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY } from '@/common/constants/inject-tokens';
import { UserRepository } from '../ports/user-repository';
import { UserModel } from '../models/user.model';

@Injectable()
export class GetUserByEmailService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<UserModel> {
    const user = await this.usersRepository.getByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
