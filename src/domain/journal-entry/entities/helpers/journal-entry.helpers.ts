import { AppError } from '../../../../shared/value-objects/error';
import {
  ETransactionDirection,
  UTransactionDirection,
} from '../../../transaction/types/transaction.types';
import dateUtils from '../../../../shared/utils/date';

function validateDirection(direction: UTransactionDirection) {
  const isInvalidDirection = ![
    ETransactionDirection.Debit,
    ETransactionDirection.Credit,
  ].includes(direction);

  if (isInvalidDirection) {
    throw new AppError('Invalid direction', {
      cause: direction,
    });
  }
}

function validatePostedAt(postedAt: Date | null) {
  if (postedAt) {
    dateUtils.isNotInThePast(postedAt);
  }
}

const journalEntryHelpers = Object.freeze({
  validateDirection,
  validatePostedAt,
});

export default journalEntryHelpers;
