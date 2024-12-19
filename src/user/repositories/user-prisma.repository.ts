import { PrismaClient } from '@/common/prisma/client';
import { UserRepository } from '../ports/user-repository';
import { UserModel } from '../models/user.model';
import { Prisma, User as PrismaUser } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ListUsersParamsDTO } from '../dtos/list-users-params.dto';
import { mapPrismaUserToModel } from '@/common/mappers/prisma/map-user-to-model';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly client: PrismaClient) {}

  private mapToModel(user: PrismaUser): UserModel {
    return mapPrismaUserToModel(user);
  }

  private buildListQuery(dto: ListUsersParamsDTO): Prisma.UserWhereInput {
    return {
      ...(dto.email ? { email: dto.email } : {}),
      ...(dto.name ? { name: { startsWith: dto.name, mode: 'insensitive' } } : {}),
      ...(dto.search
        ? {
            OR: [
              { name: { startsWith: dto.search, mode: 'insensitive' } },
              { email: { contains: dto.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }

  async getById(id: number): Promise<UserModel | null> {
    const user = await this.client.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;
    return this.mapToModel(user);
  }

  async getByEmail(email: string): Promise<UserModel | null> {
    const user = await this.client.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;
    return this.mapToModel(user);
  }

  async create(user: UserModel): Promise<UserModel> {
    const created = await this.client.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return this.mapToModel(created);
  }

  async update(user: UserModel): Promise<UserModel> {
    const updated = await this.client.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return this.mapToModel(updated);
  }

  async deleteById(id: number): Promise<UserModel> {
    const deleted = await this.client.user.delete({
      where: {
        id,
      },
    });
    return this.mapToModel(deleted);
  }

  async deleteByEmail(email: string): Promise<UserModel> {
    const deleted = await this.client.user.delete({
      where: {
        email,
      },
    });

    return this.mapToModel(deleted);
  }

  async list(dto: ListUsersParamsDTO): Promise<UserModel[]> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;

    const users = await this.client.user.findMany({
      where: this.buildListQuery(dto),
      skip: (page - 1) * limit,
      take: limit,
    });

    return users.map(this.mapToModel);
  }

  async count(dto: ListUsersParamsDTO): Promise<number> {
    return await this.client.user.count({
      where: this.buildListQuery(dto),
    });
  }
}
