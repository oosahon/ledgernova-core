import { AppError } from '../../../../shared/value-objects/error';
import dateUtils from '../../../../shared/utils/date';
import {
  EJournalDirection,
  UJournalDirection,
} from '../../types/journal-entry.types';

function validateDirection(direction: UJournalDirection) {
  const isInvalidDirection = ![
    EJournalDirection.Debit,
    EJournalDirection.Credit,
  ].includes(direction);

  if (isInvalidDirection) {
    throw new AppError('Invalid direction', {
      cause: direction,
    });
  }
}

function validatePostedAt(postedAt: Date | null) {
  if (postedAt) {
    dateUtils.validateDateIsNotInThePast(postedAt);
  }
}

const journalEntryHelpers = Object.freeze({
  validateDirection,
  validatePostedAt,
});

export default journalEntryHelpers;
