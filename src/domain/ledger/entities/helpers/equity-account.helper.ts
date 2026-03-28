import { AppError } from '../../../../shared/value-objects/error';
import {
  EEquityAccountType,
  EEquityAccountSubType,
  EEquityOwnerSubType,
} from '../../types/equity-account.types';

/**
 * Validates the ledger type.
 * @param type - The ledger type.
 */
function validateLedgerType(type: string) {
  const isValid = Object.values(EEquityAccountType).includes(type);
  if (!isValid) {
    throw new AppError('Invalid equity account type', { cause: type });
  }
}

/**
 * Validates the owner investment sub type.
 * @param subType - The owner investment sub type.
 */
function validateOwnerInvestmentSubType(subType: string) {
  const isValid = Object.values(EEquityOwnerSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid owner investment account sub type', {
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

  if (subType === EEquityAccountSubType.Other) {
    return;
  }

  if (accountType === EEquityAccountType.OwnerInvestment) {
    validateOwnerInvestmentSubType(subType);
  } else {
    const isValid = Object.values(EEquityAccountSubType).includes(subType);
    if (!isValid) {
      throw new AppError('Invalid equity account sub type', { cause: subType });
    }
  }
}

const equityAccountHelpers = Object.freeze({
  validateLedgerType,
  validateLedgerSubType,
});

export default equityAccountHelpers;
