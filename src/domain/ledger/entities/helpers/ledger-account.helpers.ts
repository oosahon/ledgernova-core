import { AppError } from '../../../../shared/value-objects/error';
import { ELedgerType, ULedgerType } from '../../types/index.types';
import assetAccountHelpers from './asset-account.helpers';
import equityAccountHelpers from './equity-account.helper';
import expenseAccountHelpers from './expense-account.helpers';
import liabilityAccountHelpers from './liability-account.helper';
import revenueAccountHelpers from './revenue-account.helpers';

function validateLedgerType(type: ULedgerType) {
  const isValid = Object.values(ELedgerType).includes(type);
  if (!isValid) {
    throw new AppError('Invalid account type', { cause: type });
  }
}

function validateLedgerAccountType(
  ledgerType: ULedgerType,
  ledgerAccountType: string
) {
  validateLedgerType(ledgerType);

  const validators = {
    [ELedgerType.Asset]: assetAccountHelpers.validateLedgerType,
    [ELedgerType.Equity]: equityAccountHelpers.validateLedgerType,
    [ELedgerType.Liability]: liabilityAccountHelpers.validateLedgerType,
    [ELedgerType.Revenue]: revenueAccountHelpers.validateLedgerType,
    [ELedgerType.Expense]: expenseAccountHelpers.validateLedgerType,
  };

  validators[ledgerType](ledgerAccountType);
}

function validateLedgerAccountSubType(
  ledgerType: ULedgerType,
  ledgerAccountType: string,
  ledgerAccountSubType: string
) {
  validateLedgerType(ledgerType);

  const validators = {
    [ELedgerType.Asset]: assetAccountHelpers.validateLedgerSubType,
    [ELedgerType.Equity]: equityAccountHelpers.validateLedgerSubType,
    [ELedgerType.Liability]: liabilityAccountHelpers.validateLedgerSubType,
    [ELedgerType.Revenue]: revenueAccountHelpers.validateLedgerSubType,
    [ELedgerType.Expense]: expenseAccountHelpers.validateLedgerSubType,
  };

  validators[ledgerType](ledgerAccountType, ledgerAccountSubType);
}

const ledgerAccountHelpers = Object.freeze({
  validateLedgerType,
  validateLedgerAccountType,
  validateLedgerAccountSubType,
});

export default ledgerAccountHelpers;
