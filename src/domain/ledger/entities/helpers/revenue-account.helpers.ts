import { AppError } from '../../../../shared/value-objects/error';
import {
  ERevenueAccountType,
  ERevenueAccountSubType,
  EOperatingRevenueSubType,
  EOtherRevenueSubType,
} from '../../types/revenue-account.types';

/**
 * Validates the ledger type.
 * @param type - The ledger type.
 */
function validateLedgerType(type: string) {
  const isValid = Object.values(ERevenueAccountType).includes(type);
  if (!isValid) {
    throw new AppError('Invalid revenue account type', { cause: type });
  }
}

/**
 * Validates the operating revenue sub type.
 * @param subType - The operating revenue sub type.
 */
function validateOperatingRevenueSubType(subType: string) {
  const isValid = Object.values(EOperatingRevenueSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid operating revenue account sub type', {
      cause: subType,
    });
  }
}

/**
 * Validates the other revenue sub type.
 * @param subType - The other revenue sub type.
 */
function validateOtherRevenueSubType(subType: string) {
  const isValid = Object.values(EOtherRevenueSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid other revenue account sub type', {
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

  if (subType === ERevenueAccountSubType.Other) {
    return;
  }

  if (accountType === ERevenueAccountType.Operating) {
    validateOperatingRevenueSubType(subType);
  } else if (accountType === ERevenueAccountType.Other) {
    validateOtherRevenueSubType(subType);
  } else {
    const isValid = Object.values(ERevenueAccountSubType).includes(subType);
    if (!isValid) {
      throw new AppError('Invalid revenue account sub type', {
        cause: subType,
      });
    }
  }
}

const revenueAccountHelpers = Object.freeze({
  validateLedgerType,
  validateLedgerSubType,
});

export default revenueAccountHelpers;
