import { z } from 'zod';
import { AppError } from '../value-objects/error';

interface ISanitizeOptions {
  min: number;
  max: number;
}

function sanitizeAndValidateString(
  value: string | null,
  options: ISanitizeOptions
) {
  if (value === null) {
    return null;
  }

  const schema = z.string().min(options.min).max(options.max);
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new AppError('Invalid string', { cause: value });
  }

  return result.data;
}

const stringUtils = Object.freeze({
  sanitizeAndValidate: sanitizeAndValidateString,
});

export default stringUtils;
