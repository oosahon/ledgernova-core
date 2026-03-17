import eventValue from '../../../shared/value-objects/event.vo';
import { IJournalEntry } from '../types/journal-entry.types';

export const EJournalEntryEvents = {
  Created: 'domain:journal-entry:created',
};

function makeCreatedEvent(journalEntry: IJournalEntry) {
  return eventValue.make<IJournalEntry>({
    type: EJournalEntryEvents.Created,
    data: journalEntry,
  });
}

const journalEntryEvents = Object.freeze({
  created: makeCreatedEvent,
});

export default journalEntryEvents;
