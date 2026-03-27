import { AppError } from '../../../../shared/value-objects/error';
import {
  ELiabilityAccountType,
  ELiabilityAccountSubType,
  EPayableAccountSubType,
  ELoanAccountSubType,
} from '../../types/liability-account.types';

/**
 * Validates the ledger type.
 * @param type - The ledger type.
 */
function validateLedgerType(type: string) {
  const isValid = Object.values(ELiabilityAccountType).includes(type);
  if (!isValid) {
    throw new AppError('Invalid liability account type', { cause: type });
  }
}

/**
 * Validates the payable sub type.
 * @param subType - The payable sub type.
 */
function validatePayableSubType(subType: string) {
  const isValid = Object.values(EPayableAccountSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid payable account sub type', {
      cause: subType,
    });
  }
}

/**
 * Validates the loan sub type.
 * @param subType - The loan sub type.
 */
function validateLoanSubType(subType: string) {
  const isValid = Object.values(ELoanAccountSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid loan account sub type', {
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

  if (subType === ELiabilityAccountSubType.Other) {
    return;
  }

  if (accountType === ELiabilityAccountType.Payable) {
    validatePayableSubType(subType);
  } else if (accountType === ELiabilityAccountType.Loan) {
    validateLoanSubType(subType);
  } else {
    const isValid = Object.values(ELiabilityAccountSubType).includes(subType);
    if (!isValid) {
      throw new AppError('Invalid liability account sub type', {
        cause: subType,
      });
    }
  }
}

const liabilityAccountHelpers = Object.freeze({
  validateLedgerType,
  validateLedgerSubType,
});

export default liabilityAccountHelpers;
