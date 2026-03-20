import stringUtils from '../../../shared/utils/string';
import { AppError } from '../../../shared/value-objects/error';
import {
  ETransactionType,
  UTransactionType,
} from '../../transaction/types/transaction.types';

function make(type: UTransactionType, createdBy?: string | null) {
  if (!Object.values(ETransactionType).includes(type)) {
    throw new AppError('Invalid transaction type', { cause: type });
  }

  if (createdBy) {
    stringUtils.validateUUID(createdBy);
  }

  const base = `${type}:other`;

  return createdBy ? `${base}::${createdBy}` : base;
}

function isValid(taxKey: string, type: UTransactionType) {
  if (!taxKey || typeof taxKey !== 'string') return false;

  const [baseTaxKey, createdBy] = taxKey.split('::');

  if (createdBy) {
    stringUtils.validateUUID(createdBy);
  }

  return baseTaxKey.startsWith(type);
}

function validate(taxKey: string, type: UTransactionType) {
  if (!isValid(taxKey, type)) {
    throw new AppError('Invalid tax key', { cause: taxKey });
  }
}

function getBaseTaxKey(taxKey: string) {
  return taxKey.split('::')[0];
}

const taxKeyValue = Object.freeze({
  make,
  isValid,
  getBaseTaxKey,
  validate,
});

export default taxKeyValue;
