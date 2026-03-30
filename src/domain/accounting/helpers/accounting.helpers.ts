import { AppError } from '../../../shared/value-objects/error';
import { ULedgerType } from '../../ledger/types/index.types';
import ledgerCodeRules from '../rules/account-codes.rule';
import {
  EAccountingEntityType,
  UAccountingEntityType,
} from '../types/accounting.types';

function isValidEntityType(domain: UAccountingEntityType) {
  return Object.values(EAccountingEntityType).includes(domain);
}

function validateEntityType(domain: UAccountingEntityType) {
  if (!isValidEntityType(domain)) {
    throw new AppError('Invalid accounting domain', { cause: domain });
  }
}

function isValidLedgerCode(
  ledgerType: ULedgerType,
  ledgerCode: string
): boolean {
  const rootCode = ledgerCodeRules.LEDGER_CODES[ledgerType];
  if (!rootCode) return false;

  if (typeof ledgerCode !== 'string' || !/^\d{5}$/.test(ledgerCode)) {
    return false;
  }

  const expectedPrefix = rootCode[0];
  return ledgerCode.startsWith(expectedPrefix);
}

function validateLedgerCode(ledgerType: ULedgerType, ledgerCode: string) {
  if (!isValidLedgerCode(ledgerType, ledgerCode)) {
    throw new AppError('Invalid ledger code', { cause: ledgerCode });
  }
}

const accountingHelpers = Object.freeze({
  isValidEntityType,
  validateEntityType,

  isValidLedgerCode,
  validateLedgerCode,
});

export default accountingHelpers;
