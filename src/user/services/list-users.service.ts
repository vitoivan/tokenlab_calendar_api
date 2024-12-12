import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from '@/common/constants/inject-tokens';
import { UserRepository } from '../ports/user-repository';
import { ListUsersParamsDTO } from '../dtos/list-users-params.dto';
import { ListUsersResponseDTO } from '../dtos/list-users-response.dto';

@Injectable()
export class ListUsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UserRepository,
  ) {}

  async execute(dto: ListUsersParamsDTO): Promise<ListUsersResponseDTO> {
    if (!dto.limit || dto.limit < 0) {
      dto.limit = 10;
    }
    if (!dto.page || dto.page < 0) {
      dto.page = 1;
    }

    const users = await this.usersRepository.list(dto);
    const count = await this.usersRepository.count(dto);

    const data = users.map((u) => u.toResponse());
    const totalPages = Math.ceil(count / dto.limit);

    return {
      data: data,
      page: dto.page,
      limit: dto.limit,
      totalPages: totalPages || 1,
      totalRecords: count,
    };
  }
}
