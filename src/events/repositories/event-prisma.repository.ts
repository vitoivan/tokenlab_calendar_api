import { PrismaClient } from '@/common/prisma/client';
import { Event as PrismaEvent, User, EventUser } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { EventsRepository } from '../ports/event-repository';
import { EventModel } from '../models/event.model';
import { mapPrismaEventToModel } from '@/common/mappers/prisma/map-event-to-model';

type MapToModelParams = PrismaEvent & { owner?: User; EventUser?: (EventUser & { user?: User })[] };

@Injectable()
export class EventsPrismaRepository implements EventsRepository {
  constructor(private readonly client: PrismaClient) {}

  private mapToModel(evt: MapToModelParams): EventModel {
    const users = evt.EventUser?.map((eu) => eu.user) || [];
    return mapPrismaEventToModel(evt, evt.owner, users);
  }

  async create(event: EventModel): Promise<EventModel> {
    const created = await this.client.event.create({
      data: {
        ownerId: event.ownerId,
        name: event.name,
        start: event.start,
        end: event.end,
        description: event.description,
        EventUser: {
          create: { userId: event.ownerId },
        },
      },
      include: {
        owner: true,
        EventUser: {
          include: { user: true },
        },
      },
    });

    return this.mapToModel(created);
  }

  async getById(id: number): Promise<EventModel | null> {
    const event = await this.client.event.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        EventUser: {
          include: { user: true },
        },
      },
    });

    if (!event) return null;

    return this.mapToModel(event);
  }

  async update(event: EventModel): Promise<EventModel> {
    const updated = await this.client.event.update({
      where: {
        id: event.id,
      },
      data: {
        name: event.name,
        start: event.start,
        end: event.end,
        description: event.description,
      },
    });

    return this.mapToModel(updated);
  }

  async delete(id: number): Promise<EventModel> {
    const deleted = await this.client.event.delete({
      where: {
        id,
      },
      include: {
        owner: true,
        EventUser: {
          include: { user: true },
        },
      },
    });

    return this.mapToModel(deleted);
  }

  async getUserEvents(userId: number, start: Date, end: Date): Promise<EventModel[]> {
    const events = await this.client.event.findMany({
      where: {
        EventUser: {
          some: {
            userId,
          },
        },
        OR: [
          {
            start: {
              gte: start,
            },
            end: {
              lte: end,
            },
          },
          {
            start: {
              lte: end,
            },
            end: {
              gte: start,
            },
          },
        ],
      },
      include: {
        EventUser: {
          include: {
            user: true,
          },
        },
        owner: true,
      },
    });

    return events.map(this.mapToModel);
  }

  async listUserEvents(userId: number): Promise<EventModel[]> {
    const events = await this.client.event.findMany({
      where: {
        EventUser: {
          some: {
            userId,
          },
        },
      },
      include: {
        EventUser: {
          include: {
            user: true,
          },
        },
        owner: true,
      },
    });

    return events.map((e) =>
      mapPrismaEventToModel(
        e,
        e.owner,
        e.EventUser.map((u) => u.user),
      ),
    );
  }

  async registerUsers(id: number, users: number[]): Promise<EventModel> {
    const events = await this.client.event.update({
      where: {
        id,
      },
      data: {
        EventUser: {
          createMany: {
            data: users.map((user) => ({
              userId: user,
            })),
          },
        },
      },
      include: {
        EventUser: {
          include: {
            user: true,
          },
        },
      },
    });

    return this.mapToModel(events);
  }

  async setUsers(id: number, users: number[]): Promise<EventModel> {
    const events = await this.client.event.update({
      where: {
        id,
      },
      data: {
        EventUser: {
          deleteMany: {
            eventId: id,
          },
          createMany: {
            data: users.map((user) => ({
              userId: user,
            })),
          },
        },
      },
      include: {
        EventUser: {
          include: {
            user: true,
          },
        },
      },
    });

    return this.mapToModel(events);
  }

  async getConflictingEvents(userId: number, start: Date, end: Date): Promise<EventModel[]> {
    const events = await this.client.event.findMany({
      where: {
        EventUser: {
          some: {
            userId,
          },
        },
        OR: [
          {
            AND: [
              {
                start: {
                  gte: start,
                },
              },
              {
                start: {
                  lt: end,
                },
              },
            ],
          },
          {
            AND: [
              {
                end: {
                  gt: start,
                },
              },
              {
                end: {
                  lte: end,
                },
              },
            ],
          },
          {
            AND: [
              {
                start: {
                  lte: start,
                },
              },
              {
                end: {
                  gte: end,
                },
              },
            ],
          },
          {
            AND: [
              {
                start: {
                  gte: start,
                },
              },
              {
                end: {
                  lte: end,
                },
              },
            ],
          },
        ],
      },
    });

    return events.map(this.mapToModel);
  }

  async eventUnsubscribe(eventId: number, userId: number): Promise<void> {
    await this.client.eventUser.deleteMany({
      where: {
        AND: [{ eventId }, { userId }],
      },
    });
  }
}
