import {
  ECategoryFlowType,
  ICategory,
  UCategoryFlowType,
} from '../../types/category.types';
import { AppError } from '../../../../shared/value-objects/error';
import stringUtils from '../../../../shared/utils/string';

function sanitizeName(name: string): string {
  return stringUtils.sanitizeAndValidate(name, {
    min: 1,
    max: 100,
  });
}

function validateUserAndParentId(
  payload: Pick<ICategory, 'parentId' | 'userId'>
) {
  const { parentId, userId } = payload;

  if (!parentId && !userId) {
    return;
  }
  const isWrongSubCategory = (!!userId && !parentId) || (!!parentId && !userId);

  if (isWrongSubCategory) {
    throw new AppError(
      'A user id must be provided along with a parent id for sub categories.',
      { cause: payload }
    );
  }

  stringUtils.validateUUID(parentId as string);
  stringUtils.validateUUID(userId as string);
}

function isValidFlowType(flowType: UCategoryFlowType) {
  return Object.values(ECategoryFlowType).includes(flowType);
}

function validateFlowType(flowType: UCategoryFlowType) {
  if (!isValidFlowType(flowType)) {
    throw new AppError('Invalid flow type', { cause: flowType });
  }
}

function sanitizeDescription(description: string) {
  return stringUtils.sanitizeAndValidate(description, {
    min: 0,
    max: 250,
  });
}

const categoryUtils = Object.freeze({
  sanitizeName,
  validateUserAndParentId,

  isValidFlowType,
  validateFlowType,
  sanitizeDescription,
});

export default categoryUtils;
