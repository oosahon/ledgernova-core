import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import accountEntity from '../../account/entities/account.entity';
import { IJournalEntry } from '../types/journal-entry.types';
import { UTransactionDirection } from '../../transaction/types/transaction.types';
import helpers from './helpers/journal-entry.helpers';
import moneyValue from '../../../shared/value-objects/money.vo';
import stringUtils from '../../../shared/utils/string';
import { TEntityWithEvents } from '../../../shared/types/event.types';
import journalEntryEvents from '../events/journal-entry.event';

/**
 * Creates a new journal entry.
 * @param direction The direction of the transaction.
 * @param payload The payload of the journal entry.
 * @returns A tuple containing the journal entry and the events.
 * - The direction payload has been separated for explicitness
 */
function make(
  direction: UTransactionDirection,
  payload: TCreationOmits<IJournalEntry, 'direction'>
): TEntityWithEvents<IJournalEntry, IJournalEntry> {
  helpers.validateDirection(direction);
  accountEntity.validateType(payload.ledgerAccountType);
  moneyValue.validate(payload.amount);
  moneyValue.validate(payload.functionalAmount);
  helpers.validatePostedAt(payload.postedAt);

  const timestamp = new Date();

  const description = stringUtils.sanitizeAndValidate(payload.description, {
    min: 0,
    max: 255,
  });

  const journalEntry = Object.freeze({
    id: generateUUID(),
    direction,
    ledgerAccountType: payload.ledgerAccountType,
    accountId: payload.accountId,
    transactionId: payload.transactionId,
    amount: payload.amount,
    functionalAmount: payload.functionalAmount,
    description,
    postedAt: payload.postedAt,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  const event = journalEntryEvents.created(journalEntry);
  return [journalEntry, [event]];
}

const journalEntriesEntity = Object.freeze({
  make,
  ...helpers,
});

export default journalEntriesEntity;
