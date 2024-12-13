import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateEventDTO {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsDateString()
  @IsOptional()
  start?: Date;
  @IsDateString()
  @IsOptional()
  end?: Date;
}
