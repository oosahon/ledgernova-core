import { z } from 'zod';
import { AppError } from '../value-objects/error';

interface ISanitizeOptions {
  min: number;
  max: number;
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

const stringUtils = Object.freeze({
  sanitizeAndValidate: sanitizeAndValidateString,
  isUUID,
  validateUUID,
});

export default stringUtils;
