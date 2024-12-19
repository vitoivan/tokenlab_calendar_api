import { HttpLoggingInterceptor } from '@/common/middlewares/logging.interceptor';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseInterceptors } from '@nestjs/common';
import { CreateEventService } from './services/create-event.service';
import { UpdateEventService } from './services/update-event.service';
import { DeleteEventService } from './services/delete-event.service';
import { GetEventByIdService } from './services/get-event-by-id.service';
import { CreateEventDTO } from './dtos/create-event.dto';
import { User } from '@/common/decorators/user';
import { UserModel } from '@/user/models/user.model';
import { UpdateEventDTO } from './dtos/update-user.dto';
import { EventModel } from './models/event.model';
import { SetEventUsersDTO } from './dtos/set-event-users.dto';
import { SetEventUsersService } from './services/set-event-users.service';

@UseInterceptors(HttpLoggingInterceptor)
@Controller('events')
export class EventsController {
  constructor(
    private readonly createEventService: CreateEventService,
    private readonly updateEventService: UpdateEventService,
    private readonly deleteEventService: DeleteEventService,
    private readonly getEventByIdService: GetEventByIdService,
    private readonly setEventUsersService: SetEventUsersService,
  ) {}

  @Get('/:id')
  async getById(@Param('id') id: number): Promise<EventModel> {
    return await this.getEventByIdService.execute(id);
  }

  @Post()
  async create(@Body() dto: CreateEventDTO, @User() user: UserModel): Promise<EventModel> {
    return await this.createEventService.execute(user.id, dto);
  }

  @Put('/:id/users')
  async setEventUsers(@Param('id') id: number, @Body() dto: SetEventUsersDTO): Promise<EventModel> {
    return await this.setEventUsersService.execute(id, dto.users);
  }

  @Patch('/:id')
  async update(@Body() dto: UpdateEventDTO, @Param('id') id: number, @User() user: UserModel): Promise<EventModel> {
    return await this.updateEventService.execute(id, user.id, dto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number, @User() user: UserModel): Promise<EventModel> {
    return await this.deleteEventService.execute(id, user.id);
  }
}
