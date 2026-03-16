import dayjs from 'dayjs';
import { AppError } from '../value-objects/error';

function isValidDate(date: Date | string | number) {
  return dayjs(date).isValid();
}

function validateDate(date: Date | string | number) {
  if (!isValidDate(date)) {
    throw new AppError('Invalid date', { cause: date });
  }
}

function isNotInThePast(date: Date | string | number) {
  return dayjs(date).isAfter(dayjs());
}

function validateDateIsNotInThePast(date: Date | string | number) {
  if (!isNotInThePast(date)) {
    throw new AppError('Date is in the past', { cause: date });
  }
}

const dateUtils = Object.freeze({
  isValidDate,
  validateDate,

  isNotInThePast,
  validateDateIsNotInThePast,
});

export default dateUtils;
