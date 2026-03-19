import { ICategory } from '../../types/category.types';
import { AppError } from '../../../../shared/value-objects/error';
import stringUtils from '../../../../shared/utils/string';

function sanitizeName(name: string): string {
  return stringUtils.sanitizeAndValidate(name, {
    min: 1,
    max: 100,
  });
}

function validateCreatorAndParentId(
  payload: Pick<ICategory, 'parentId' | 'createdBy'>
) {
  const { parentId, createdBy } = payload;

  if (!parentId && !createdBy) {
    return;
  }
  const isWrongSubCategory =
    (!!createdBy && !parentId) || (!!parentId && !createdBy);

  if (isWrongSubCategory) {
    throw new AppError(
      'A user id must be provided along with a parent id for sub categories.',
      { cause: payload }
    );
  }

  stringUtils.validateUUID(parentId as string);
  stringUtils.validateUUID(createdBy as string);
}

function sanitizeDescription(description: string) {
  return stringUtils.sanitizeAndValidate(description, {
    min: 0,
    max: 250,
  });
}

const categoryUtils = Object.freeze({
  sanitizeName,
  validateCreatorAndParentId,
  sanitizeDescription,
});

export default categoryUtils;
