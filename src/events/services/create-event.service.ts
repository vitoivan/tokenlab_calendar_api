import { EVENTS_REPOSITORY } from '@/common/constants/inject-tokens';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventsRepository } from '../ports/event-repository';
import { CreateEventDTO } from '../dtos/create-event.dto';
import { EventModel } from '../models/event.model';
import { normalizeEventDate } from '@/common/normalizers/normalize-event-date';

@Injectable()
export class CreateEventService {
  constructor(
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepo: EventsRepository,
  ) {}

  async execute(ownerId: number, dto: CreateEventDTO): Promise<EventModel> {
    const start = normalizeEventDate(dto.start);
    const end = normalizeEventDate(dto.end);

    if (start > end) {
      throw new BadRequestException('start date cannot be later than end date');
    }

    const toCreate = new EventModel({
      name: dto.name,
      description: dto.description,
      start,
      end,
      ownerId: ownerId,
    });

    return await this.eventsRepo.create(toCreate);
  }
}
