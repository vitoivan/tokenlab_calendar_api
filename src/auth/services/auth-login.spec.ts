import { Test } from '@nestjs/testing';
import { AuthTokensService } from './auth-tokens.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@/user/user.module';
import { CreateUserService } from '@/user/services/create-user.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthLoginService } from './auth-login.service';

describe('auth login service', () => {
  let authLoginService: AuthLoginService;
  let authTokensService: AuthTokensService;
  let createUserService: CreateUserService;

  beforeEach(async () => {
    const jwtSecret = 'test';

    const moduleRef = await Test.createTestingModule({
      controllers: [],
      imports: [
        UserModule,
        ConfigModule.forRoot({
          load: [
            () => ({
              jwt: {
                secret: jwtSecret,
              },
            }),
          ],
        }),
        JwtModule.register({
          secret: jwtSecret,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [AuthTokensService, AuthLoginService],
    }).compile();

    authLoginService = moduleRef.get<AuthLoginService>(AuthLoginService);
    authTokensService = moduleRef.get<AuthTokensService>(AuthTokensService);
    createUserService = moduleRef.get<CreateUserService>(CreateUserService);
  });

  it('should return an error', async () => {
    try {
      await authLoginService.execute({
        email: 'asd@email.com',
        password: '123456',
      });
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should return valid access and refresh tokens', async () => {
    const created = await createUserService.execute({
      password: '123456',
      name: 'test',
      email: 'test@gmail.com',
    });

    const res = await authLoginService.execute({
      email: created.email,
      password: '123456',
    });

    expect(res).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
