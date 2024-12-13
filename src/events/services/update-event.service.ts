import { EVENTS_REPOSITORY } from '@/common/constants/inject-tokens';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EventsRepository } from '../ports/event-repository';
import { EventModel } from '../models/event.model';
import { UpdateEventDTO } from '../dtos/update-user.dto';
import { GetEventByIdService } from './get-event-by-id.service';
import { normalizeEventDate } from '@/common/normalizers/normalize-event-date';

@Injectable()
export class UpdateEventService {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepo: EventsRepository,
    private readonly getEventByIdService: GetEventByIdService,
  ) {}

  async execute(id: number, ownerId: number, dto: UpdateEventDTO): Promise<EventModel> {
    const eventFound = await this.getEventByIdService.execute(id);

    if (eventFound.ownerId !== ownerId) {
      throw new UnauthorizedException('only the event owner can update the event');
    }

    const start = normalizeEventDate(dto.start);
    const end = normalizeEventDate(dto.end);

    if (dto.name) {
      eventFound.name = dto.name;
    }

    if (dto.description) {
      eventFound.description = dto.description;
    }
    if (start) {
      eventFound.start = dto.start;
    }
    if (end) {
      eventFound.end = dto.end;
    }

    if (eventFound.start > eventFound.end) {
      throw new UnauthorizedException('start date cannot be later than end date');
    }

    return await this.eventsRepo.update(eventFound);
  }
}
