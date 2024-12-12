import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { USERS_REPOSITORY } from 'src/common/constants/inject-tokens';
import { UserController } from '@/user/user.controller';
import { GetUserByIdService } from '@/user/services/get-user-by-id.service';
import { GetUserByEmailService } from '@/user/services/get-user-by-email.service';
import { CreateUserService } from '@/user/services/create-user.service';
import { DeleteUserByIdService } from '@/user/services/delete-user-by-id.service';
import { DeleteUserByEmailService } from '@/user/services/delete-user-by-email.service';
import { ListUsersService } from '@/user/services/list-users.service';
import { UpdateUserService } from '@/user/services/update-user.service';
import { usersRepositoryFactory } from '@/user/repositories/factory';

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
