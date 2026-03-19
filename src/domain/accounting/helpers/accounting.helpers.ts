import { AppError } from '../../../shared/value-objects/error';
import { ULedgerType } from '../../ledger-account/types/index.types';
import ledgerCodeRules from '../rules/account-codes.rule';
import {
  EAccountingDomain,
  UAccountingDomain,
} from '../types/accounting.types';

function isValidDomain(domain: UAccountingDomain) {
  return Object.values(EAccountingDomain).includes(domain);
}

function validateDomain(domain: UAccountingDomain) {
  if (!isValidDomain(domain)) {
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
  isValidDomain,
  validateDomain,

  isValidLedgerCode,
  validateLedgerCode,
});

export default accountingHelpers;
