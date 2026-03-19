import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { TEntityWithEvents } from '../../../shared/types/event.types';
import stringUtils from '../../../shared/utils/string';
import generateUUID from '../../../shared/utils/uuid-generator';
import accountingHelpers from '../../accounting/helpers/accounting.helpers';
import taxKeyValue from '../../tax/value-objects/tax-keys.vo';
import transactionEntity from '../../transaction/entities/transaction.entity';
import categoryEvents from '../events/category.events';
import { ECategoryStatus, ICategory } from '../types/category.types';
import helpers from './helpers/category.helpers';

/**
 * Creates a new category entity along with its events
 */
function make(
  payload: TCreationOmits<ICategory, 'status'> & { taxKey?: string }
): TEntityWithEvents<ICategory, ICategory> {
  const timestamps = new Date();

  transactionEntity.validateType(payload.type);
  helpers.validateCreatorAndParentId(payload);
  accountingHelpers.validateDomain(payload.accountingDomain);

  const category = Object.freeze({
    id: generateUUID(),
    name: helpers.sanitizeName(payload.name),
    accountingDomain: payload.accountingDomain,
    taxKey: taxKeyValue.make(payload.type, payload.createdBy),
    type: payload.type,
    parentId: payload.parentId,
    description: helpers.sanitizeDescription(payload.description),
    createdBy: payload.createdBy,
    status: ECategoryStatus.Active,
    createdAt: timestamps,
    updatedAt: timestamps,
    deletedAt: null,
  });
  const event = categoryEvents.created(category);
  return [category, [event]];
}

/**
 * Updates a category entity along with its events
 */
function update(
  category: ICategory,
  options: Partial<Pick<ICategory, 'name' | 'description'>>
): TEntityWithEvents<ICategory, ICategory> {
  const description = options.description ?? category.description;

  const sanitizedDescription = stringUtils.sanitizeAndValidate(description, {
    min: 0,
    max: 255,
  }) as string;

  const updatedCategory = Object.freeze({
    ...category,
    name: options.name ? helpers.sanitizeName(options.name) : category.name,
    description: sanitizedDescription,
    updatedAt: new Date(),
  });
  const event = categoryEvents.updated(updatedCategory);
  return [updatedCategory, [event]];
}

/**
 * Archives a category entity idempotently along with its events
 */
function archive(category: ICategory): TEntityWithEvents<ICategory, ICategory> {
  if (category.status === 'archived') {
    return [category, []];
  }

  const updatedCategory = Object.freeze({
    ...category,
    status: 'archived',
    updatedAt: new Date(),
  });
  const event = categoryEvents.archived(updatedCategory);
  return [updatedCategory, [event]];
}

/**
 * Unarchives a category entity idempotently along with its events
 */
function unarchive(
  category: ICategory
): TEntityWithEvents<ICategory, ICategory> {
  if (category.status === 'active') {
    return [category, []];
  }

  const updatedCategory = Object.freeze({
    ...category,
    status: 'active',
    updatedAt: new Date(),
  });
  const event = categoryEvents.unarchived(updatedCategory);
  return [updatedCategory, [event]];
}

const categoryEntity = Object.freeze({
  make,
  update,
  archive,
  unarchive,
  ...helpers,
});

export default categoryEntity;
