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

const stringUtils = Object.freeze({
  sanitizeAndValidate: sanitizeAndValidateString,
  isUUID,
});

export default stringUtils;
