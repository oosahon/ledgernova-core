import { z } from 'zod';
import {
  ECategoryType,
  ICategory,
  UCategoryType,
} from '../../types/category.types';
import { AppError } from '../../../../shared/value-objects/error';
import { TCreationOmits } from '../../../../shared/types/creation-omits.types';
import taxKeyValue from '../../../tax/value-objects/tax-keys.vo';

function isValidCategoryType(type: UCategoryType): boolean {
  return Object.values(ECategoryType).includes(type);
}

function validateCategoryType(type: UCategoryType): void {
  const isValid = isValidCategoryType(type);

  if (!isValid) {
    throw new AppError('Invalid category type', { cause: type });
  }
}

function sanitizeName(name: string): string {
  try {
    return z.string().min(1).max(100).trim().parse(name);
  } catch (error) {
    throw new AppError('Invalid category name', { cause: name });
  }
}

function validateParentId(payload: Pick<ICategory, 'parentId' | 'userId'>) {
  const { parentId, userId } = payload;
  if (userId) {
    try {
      z.uuid().parse(parentId);
    } catch (error) {
      throw new AppError('Invalid parent id', { cause: parentId });
    }
  }

  if (parentId) {
    try {
      z.uuid().parse(parentId);
    } catch (error) {
      throw new AppError('Invalid parent id', { cause: parentId });
    }
  }
}

function getTaxKey(type: UCategoryType, userId?: string | null) {
  switch (type) {
    case ECategoryType.Income:
      return taxKeyValue.income.make(userId);

    case ECategoryType.Expense:
      return taxKeyValue.expense.make(userId);

    case ECategoryType.LiabilityIncome:
      return taxKeyValue.income.makeLiability(userId);

    case ECategoryType.LiabilityExpense:
      return taxKeyValue.expense.makeLiability(userId);

    default:
      throw new AppError('Invalid category type', {
        cause: type,
      });
  }
}

function validatePayload(payload: TCreationOmits<ICategory, 'status'>) {
  validateCategoryType(payload.type);
  validateParentId(payload);
  sanitizeName(payload.name);
}

const categoryUtils = Object.freeze({
  isValidCategoryType,
  validateCategoryType,
  sanitizeName,
  validateParentId,
  validatePayload,
  getTaxKey,
});

export default categoryUtils;
