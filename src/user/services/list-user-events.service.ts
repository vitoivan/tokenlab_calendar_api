import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EVENTS_REPOSITORY } from '@/common/constants/inject-tokens';
import { EventsRepository } from '@/events/ports/event-repository';
import { EventModel } from '@/events/models/event.model';
import { ListUserEventsDTO } from '../dtos/list-user-events.dto';
import { normalizeEventDate } from '@/common/normalizers/normalize-event-date';

@Injectable()
export class ListUserEventsService {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepository: EventsRepository,
  ) {}

  async execute(userId: number, dto: ListUserEventsDTO): Promise<EventModel[]> {
    const start = normalizeEventDate(dto.start);
    const end = normalizeEventDate(dto.end);

    if (start > end) {
      throw new BadRequestException('start date cannot be later than end date');
    }
    return await this.eventsRepository.getUserEvents(userId, start, end);
  }
}
