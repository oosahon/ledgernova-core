import { z } from 'zod';
import { AppError } from '../value-objects/error';

interface ISanitizeOptions {
  min: number;
  max: number;
}

function isString(value: string) {
  return typeof value === 'string';
}

function isNonEmptyString(value: string) {
  return isString(value) && value.trim().length > 0;
}

function sanitizeAndValidateString(value: string, options: ISanitizeOptions) {
  const schema = z.string().min(options.min).max(options.max);
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new AppError('Invalid string', { cause: value });
  }

  return result.data;
}

function isUUID(value: string) {
  return z.uuid().safeParse(value).success;
}

function validateUUID(value: string) {
  if (!isUUID(value)) {
    throw new AppError('Invalid UUID', { cause: value });
  }
}

function isNumeric(value: string) {
  return /^[0-9]+$/.test(value);
}

const stringUtils = Object.freeze({
  sanitizeAndValidate: sanitizeAndValidateString,
  isUUID,
  isNonEmptyString,
  validateUUID,
  isNumeric,
});

export default stringUtils;
