import { UserModel } from '@/user/models/user.model';
import { User } from '@prisma/client';

export function mapPrismaUserToModel(user: User): UserModel {
  if (!user) return null;
  return new UserModel({
    id: Number(user.id),
    name: user.name,
    email: user.email,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
