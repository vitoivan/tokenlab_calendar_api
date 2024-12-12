import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { GetUserByIdService } from './services/get-user-by-id.service';
import { CreateUserService } from './services/create-user.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserResponse } from './dtos/get-user.response';
import { ListUsersParamsDTO } from './dtos/list-users-params.dto';
import { ListUsersService } from './services/list-users.service';
import { DeleteUserByIdService } from './services/delete-user-by-id.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UpdateUserService } from './services/update-user.service';
import { HttpLoggingInterceptor } from '@/common/middlewares/logging.interceptor';

@UseInterceptors(HttpLoggingInterceptor)
@Controller('users')
export class UserController {
  constructor(
    private readonly getUserByIdService: GetUserByIdService,
    private readonly listUsersService: ListUsersService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserByIdService: DeleteUserByIdService,
  ) {}

  @Get()
  async list(@Query() dto: ListUsersParamsDTO) {
    return await this.listUsersService.execute(dto);
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.getUserByIdService.execute(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDTO): Promise<UserResponse> {
    const user = await this.createUserService.execute(dto);
    return user.toResponse();
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDTO): Promise<UserResponse> {
    const user = await this.updateUserService.execute(id, dto);
    return user.toResponse();
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: number) {
    return await this.deleteUserByIdService.execute(id);
  }
}
