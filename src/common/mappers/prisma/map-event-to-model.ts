import { EventModel } from '@/events/models/event.model';
import { Event, User } from '@prisma/client';
import { mapPrismaUserToModel } from './map-user-to-model';

export function mapPrismaEventToModel(evt: Event, owner?: User, users?: User[]): EventModel {
  if (!evt) return null;

  const _owner = owner ? mapPrismaUserToModel(owner).toResponse() : null;
  const _users = users?.map((u) => mapPrismaUserToModel(u).toResponse()) || [];

  return new EventModel({
    id: Number(evt.id),
    name: evt.name,
    description: evt.description,
    start: evt.start,
    end: evt.end,
    createdAt: evt.createdAt,
    updatedAt: evt.updatedAt,
    ownerId: Number(evt.ownerId),
    owner: _owner,
    users: _users,
  });
}
