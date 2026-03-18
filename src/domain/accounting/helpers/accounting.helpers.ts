import { AppError } from '../../../shared/value-objects/error';
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

const accountingHelpers = Object.freeze({
  isValidDomain,
  validateDomain,
});

export default accountingHelpers;
