import { IsArray, IsNumber } from 'class-validator';

export class SetEventUsersDTO {
  @IsNumber({}, { each: true })
  @IsArray()
  users: number[];
}
