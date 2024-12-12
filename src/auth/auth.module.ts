import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { usersRepositoryFactory } from './repositories/factory';
import { USERS_REPOSITORY } from 'src/common/constants/inject-tokens';
import { UserController } from './user.controller';
import { GetUserByIdService } from './services/get-user-by-id.service';
import { GetUserByEmailService } from './services/get-user-by-email.service';
import { CreateUserService } from './services/create-user.service';
import { DeleteUserByIdService } from './services/delete-user-by-id.service';
import { DeleteUserByEmailService } from './services/delete-user-by-email.service';
import { ListUsersService } from './services/list-users.service';
import { UpdateUserService } from './services/update-user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: usersRepositoryFactory(),
    },
    GetUserByIdService,
    GetUserByEmailService,
    CreateUserService,
    DeleteUserByIdService,
    DeleteUserByEmailService,
    UpdateUserService,
    ListUsersService,
  ],
  exports: [
    GetUserByIdService,
    GetUserByEmailService,
    CreateUserService,
    DeleteUserByIdService,
    DeleteUserByEmailService,
    UpdateUserService,
    ListUsersService,
  ],
})
export class UserModule {}
