import eventValue from '../../../shared/value-objects/event.vo';
import { ICategory } from '../types/category.types';

export enum ECategoryEvents {
  Created = 'domain:category:created',
  Updated = 'domain:category:updated',
  Archived = 'domain:category:archived',
  Unarchived = 'domain:category:unarchived',
}

function makeCreatedEvent(category: ICategory) {
  return eventValue.make<ICategory>({
    type: ECategoryEvents.Created,
    data: category,
  });
}

function makeUpdatedEvent(category: ICategory) {
  return eventValue.make<ICategory>({
    type: ECategoryEvents.Updated,
    data: category,
  });
}

function makeArchivedEvent(category: ICategory) {
  return eventValue.make<ICategory>({
    type: ECategoryEvents.Archived,
    data: category,
  });
}

function makeUnarchivedEvent(category: ICategory) {
  return eventValue.make<ICategory>({
    type: ECategoryEvents.Unarchived,
    data: category,
  });
}

const categoryEvents = Object.freeze({
  created: makeCreatedEvent,
  updated: makeUpdatedEvent,
  archived: makeArchivedEvent,
  unarchived: makeUnarchivedEvent,
});

export default categoryEvents;
