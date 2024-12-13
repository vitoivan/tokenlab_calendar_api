import { Test } from '@nestjs/testing';
import { AuthTokensService } from './auth-tokens.service';
import { ConfigModule } from '@nestjs/config';
import { JsonWebTokenError, JwtModule } from '@nestjs/jwt';

describe('auth tokens service', () => {
  let authTokensService: AuthTokensService;

  beforeEach(async () => {
    const jwtSecret = 'test';

    const moduleRef = await Test.createTestingModule({
      controllers: [],
      imports: [
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
      providers: [AuthTokensService],
    }).compile();

    authTokensService = moduleRef.get<AuthTokensService>(AuthTokensService);
  });

  it('should return the access token created', async () => {
    const token = await authTokensService.generateAccessToken({ name: 'ASD', email: 'asd@gmail.com', id: 1 });
    expect(token).toEqual(expect.any(String));
  });

  it('should return the refresh token created', async () => {
    const token = await authTokensService.generateRefreshToken({ name: 'ASD', email: 'asd@gmail.com', id: 1 });
    expect(token).toEqual(expect.any(String));
  });

  it('should return the right token payload', async () => {
    const token = await authTokensService.generateRefreshToken({ name: 'ASD', email: 'asd@gmail.com', id: 1 });
    expect(token).toEqual(expect.any(String));

    const payload = await authTokensService.verifyToken(token);

    expect(payload).toEqual({
      id: 1,
      email: 'asd@gmail.com',
      name: 'ASD',
    });
  });

  it('should a JsonWebTokenError', async () => {
    try {
      await authTokensService.verifyToken('aslkjasdlkjasdklj');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(JsonWebTokenError);
    }
  });
});
