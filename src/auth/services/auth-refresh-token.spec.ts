import { Test } from '@nestjs/testing';
import { AuthTokensService } from './auth-tokens.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { UserModule } from '@/user/user.module';
import { CreateUserService } from '@/user/services/create-user.service';
import { UnauthorizedException } from '@nestjs/common';

describe('auth refresh token service', () => {
  let authRefreshTokenService: AuthRefreshTokenService;
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
      providers: [AuthTokensService, AuthRefreshTokenService],
    }).compile();

    authRefreshTokenService = moduleRef.get<AuthRefreshTokenService>(AuthRefreshTokenService);
    authTokensService = moduleRef.get<AuthTokensService>(AuthTokensService);
    createUserService = moduleRef.get<CreateUserService>(CreateUserService);
  });

  it('should return an error', async () => {
    try {
      await authRefreshTokenService.execute({
        refreshToken: 'test',
      });
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should return a valid token', async () => {
    const created = await createUserService.execute({
      password: '123456',
      name: 'test',
      email: 'test@gmail.com',
    });

    const token = await authTokensService.generateRefreshToken({
      name: created.name,
      email: created.email,
      id: created.id,
    });

    const res = await authRefreshTokenService.execute({
      refreshToken: token,
    });

    expect(res).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should return an error if user is not found', async () => {
    const token = await authTokensService.generateRefreshToken({
      name: 'asd',
      email: 'asd@gmail',
      id: 1,
    });

    try {
      await authRefreshTokenService.execute({
        refreshToken: token,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
});
