import {
  EAssetAccountType,
  EAssetAccountSubType,
  ECashAccountSubType,
  EInvestmentAccountSubType,
  EReceivableAccountSubType,
  EInventoryAccountSubType,
  EFixedAssetAccountSubType,
} from '../../types/asset-account.types';
import { AppError } from '../../../../shared/value-objects/error';

/**
 * Validates the ledger type.
 * @param type - The ledger type.
 */
function validateLedgerType(type: string) {
  const isValid = Object.values(EAssetAccountType).includes(type);
  if (!isValid) {
    throw new AppError('Invalid asset account type', { cause: type });
  }
}

/**
 * Validates the cash and cash equivalents sub type.
 * @param subType - The cash and cash equivalents sub type.
 */
function validateCashAndCashEquivalentsSubType(subType: string) {
  const isValid = Object.values(ECashAccountSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid cash and cash equivalents account sub type', {
      cause: subType,
    });
  }
}

/**
 * Validates the investment sub type.
 * @param subType - The investment sub type.
 */
function validateInvestmentSubType(subType: string) {
  const isValid = Object.values(EInvestmentAccountSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid investment account sub type', {
      cause: subType,
    });
  }
}

/**
 * Validates the receivable sub type.
 * @param subType - The receivable sub type.
 */
function validateReceivableSubType(subType: string) {
  const isValid = Object.values(EReceivableAccountSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid receivable account sub type', {
      cause: subType,
    });
  }
}

/**
 * Validates the inventory sub type.
 * @param subType - The inventory sub type.
 */
function validateInventorySubType(subType: string) {
  const isValid = Object.values(EInventoryAccountSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid inventory account sub type', {
      cause: subType,
    });
  }
}

/**
 * Validates the fixed asset sub type.
 * @param subType - The fixed asset sub type.
 */
function validateFixedAssetSubType(subType: string) {
  const isValid = Object.values(EFixedAssetAccountSubType).includes(subType);
  if (!isValid) {
    throw new AppError('Invalid fixed asset account sub type', {
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

  if (subType === EAssetAccountSubType.Other) {
    return;
  }

  if (accountType === EAssetAccountType.Cash) {
    validateCashAndCashEquivalentsSubType(subType);
  } else if (accountType === EAssetAccountType.Investment) {
    validateInvestmentSubType(subType);
  } else if (accountType === EAssetAccountType.Receivable) {
    validateReceivableSubType(subType);
  } else if (accountType === EAssetAccountType.Inventory) {
    validateInventorySubType(subType);
  } else if (accountType === EAssetAccountType.FixedAsset) {
    validateFixedAssetSubType(subType);
  } else {
    const isValid = Object.values(EAssetAccountSubType).includes(subType);
    if (!isValid) {
      throw new AppError('Invalid asset account sub type', {
        cause: subType,
      });
    }
  }
}

const assetAccountHelpers = Object.freeze({
  validateLedgerType,
  validateLedgerSubType,
});

export default assetAccountHelpers;
