import { AppError } from '../../../../shared/value-objects/error';
import {
  EExpenseAccountType,
  EExpenseAccountSubType,
  ECostOfGoodsSoldSubType,
  EOperatingExpenseSubType,
  EOtherExpenseSubType,
} from '../../types/expense-account.types';

/**
 * Validates the ledger type.
 * @param type - The ledger type.
 */
function validateLedgerType(type: string) {
  const isValid = Object.values(EExpenseAccountType).includes(type);
  if (!isValid) {
    throw new AppError('Invalid expense account type', { cause: type });
  }
}

/**
 * Validates the cost of goods sold sub type.
 * @param subType - The cost of goods sold sub type.
 */
function validateCostOfGoodsSoldSubType(subType: string) {
  const isValid = Object.values(ECostOfGoodsSoldSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid cost of goods sold account sub type', {
      cause: subType,
    });
  }
}

/**
 * Validates the operating expense sub type.
 * @param subType - The operating expense sub type.
 */
function validateOperatingExpenseSubType(subType: string) {
  const isValid = Object.values(EOperatingExpenseSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid operating expense account sub type', {
      cause: subType,
    });
  }
}

/**
 * Validates the other expense sub type.
 * @param subType - The other expense sub type.
 */
function validateOtherExpenseSubType(subType: string) {
  const isValid = Object.values(EOtherExpenseSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid other expense account sub type', {
      cause: subType,
    });
  }
}

/**
 * Validates the ledger sub type.
 * @param accountType - The ledger account type.
 * @param subType - The ledger sub type.
 */
function validateLedgerSubType(accountType: string, subType: string) {
  validateLedgerType(accountType);

  if (subType === EExpenseAccountSubType.Other) {
    return;
  }

  if (accountType === EExpenseAccountType.CostOfGoodsSold) {
    validateCostOfGoodsSoldSubType(subType);
  } else if (accountType === EExpenseAccountType.Operating) {
    validateOperatingExpenseSubType(subType);
  } else if (accountType === EExpenseAccountType.Other) {
    validateOtherExpenseSubType(subType);
  } else {
    const isValid = Object.values(EExpenseAccountSubType).includes(subType);
    if (!isValid) {
      throw new AppError('Invalid expense account sub type', {
        cause: subType,
      });
    }
  }
}

const expenseAccountHelpers = Object.freeze({
  validateLedgerType,
  validateLedgerSubType,
});

export default expenseAccountHelpers;
