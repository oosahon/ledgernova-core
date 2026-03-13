import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import generateUUID from '../../../shared/utils/uuid-generator';
import { AppError } from '../../../shared/value-objects/error';
import taxKey from '../../tax/value-objects/tax-keys.vo';
import { ECategoryType, ICategory } from '../types/category.types';

function sanitizeName(name: string) {
  if (!name || typeof name !== 'string') {
    throw new AppError('Invalid category name');
  }

  const trimmed = name.trim();

  const isInvalid = trimmed.length === 0 || trimmed.length > 100;

  if (isInvalid) {
    throw new AppError('Invalid category name');
  }

  return trimmed;
}

function getTaxKey(type: ECategoryType, userId?: string | null) {
  switch (type) {
    case ECategoryType.Income:
    case ECategoryType.LiabilityIncome:
      return taxKey.income.make(userId);

    case ECategoryType.Expense:
    case ECategoryType.LiabilityExpense:
      return taxKey.expense.make(userId);

    default:
      throw new AppError('Invalid category type', {
        cause: type,
      });
  }
}

function make(
  payload: TCreationOmits<ICategory, 'status' | 'taxKey'>
): ICategory {
  const timestamps = new Date();

  // NB: every user category must be split from a system category
  if (payload.userId && !payload.parentId) {
    throw new AppError('No parent id provided for user category', {
      cause: payload,
    });
  }

  return Object.freeze({
    id: generateUUID(),
    name: sanitizeName(payload.name),
    taxKey: getTaxKey(payload.type, payload.userId),
    type: payload.type,
    parentId: payload.parentId,
    description: payload.description,
    userId: payload.userId,
    status: 'active',
    createdAt: timestamps,
    updatedAt: timestamps,
    deletedAt: null,
  });
}

function update(
  category: ICategory,
  options: Partial<Pick<ICategory, 'name' | 'description'>>
): ICategory {
  return Object.freeze({
    ...category,
    name: options.name ? sanitizeName(options.name) : category.name,
    description: options.description ?? category.description,
    updatedAt: new Date(),
  });
}

function archive(category: ICategory): ICategory {
  if (category.status === 'archived') {
    return category;
  }

  return Object.freeze({
    ...category,
    status: 'archived',
    updatedAt: new Date(),
  });
}

function unarchive(category: ICategory): ICategory {
  if (category.status === 'active') {
    return category;
  }

  return Object.freeze({
    ...category,
    status: 'active',
    updatedAt: new Date(),
  });
}

const category = Object.freeze({
  make,
  update,
  archive,
  unarchive,
});

export default category;
