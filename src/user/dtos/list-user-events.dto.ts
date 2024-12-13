import { IsDateString, IsNotEmpty } from 'class-validator';

export class ListUserEventsDTO {
  @IsDateString()
  @IsNotEmpty()
  start: Date;
  @IsDateString()
  @IsNotEmpty()
  end: Date;
}
