import { UserResponse } from './get-user.response';

export class ListUsersResponseDTO {
  data: UserResponse[];
  page: number;
  totalPages: number;
  limit: number;
  totalRecords: number;
}
