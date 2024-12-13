import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsDateString()
  @IsNotEmpty()
  start: Date;
  @IsDateString()
  @IsNotEmpty()
  end: Date;
}
