import { PrismaModule } from '@/common/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EVENTS_REPOSITORY } from '@/common/constants/inject-tokens';
import { eventsRepositoryFactory } from './repositories/factory';
import { GetEventByIdService } from './services/get-event-by-id.service';
import { CreateEventService } from './services/create-event.service';
import { UpdateEventService } from './services/update-event.service';
import { DeleteEventService } from './services/delete-event.service';
import { SetEventUsersService } from './services/set-event-users.service';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [
    {
      provide: EVENTS_REPOSITORY,
      useClass: eventsRepositoryFactory(),
    },
    GetEventByIdService,
    CreateEventService,
    UpdateEventService,
    SetEventUsersService,
    DeleteEventService,
  ],
  exports: [EVENTS_REPOSITORY],
})
export class EventsModule {}
