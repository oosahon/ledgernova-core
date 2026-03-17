import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import stringUtils from '../../../shared/utils/string';
import generateUUID from '../../../shared/utils/uuid-generator';
import accountEntity from '../../account/entities/account.entity';
import taxKeyValue from '../../tax/value-objects/tax-keys.vo';
import { ECategoryStatus, ICategory } from '../types/category.types';
import helpers from './helpers/category.helpers';

function make(
  payload: TCreationOmits<ICategory, 'status'> & { taxKey?: string }
): ICategory {
  const timestamps = new Date();

  accountEntity.validateType(payload.ledgerAccountType);
  helpers.validateUserAndParentId(payload);
  helpers.validateFlowType(payload.flowType);

  return Object.freeze({
    id: generateUUID(),
    name: helpers.sanitizeName(payload.name),
    taxKey: taxKeyValue.make(payload.ledgerAccountType, payload.userId),
    ledgerAccountType: payload.ledgerAccountType,
    parentId: payload.parentId,
    description: helpers.sanitizeDescription(payload.description),
    userId: payload.userId,
    status: ECategoryStatus.Active,
    flowType: payload.flowType,
    createdAt: timestamps,
    updatedAt: timestamps,
    deletedAt: null,
  });
}

function update(
  category: ICategory,
  options: Partial<Pick<ICategory, 'name' | 'description'>>
): ICategory {
  const description = options.description ?? category.description;

  const sanitizedDescription = stringUtils.sanitizeAndValidate(description, {
    min: 0,
    max: 255,
  }) as string;

  return Object.freeze({
    ...category,
    name: options.name ? helpers.sanitizeName(options.name) : category.name,
    description: sanitizedDescription,
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

const categoryEntity = Object.freeze({
  make,
  update,
  archive,
  unarchive,
  ...helpers,
});

export default categoryEntity;
