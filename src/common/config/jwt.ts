export type JWTConfig = {
  secret: string;
  expiresIn: string;
};

export function jwtConfig(): JWTConfig {
  return {
    secret: process.env.JWT_SECRET || 'my super secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  };
}
