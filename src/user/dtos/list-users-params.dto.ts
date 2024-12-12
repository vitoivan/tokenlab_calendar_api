import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListUsersParamsDTO {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @Optional()
  page: number;

  @IsNumber()
  @Type(() => Number)
  @Optional()
  limit: number;
}
