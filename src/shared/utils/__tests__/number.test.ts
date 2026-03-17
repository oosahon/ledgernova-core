import numberUtils from '../number';
import { AppError } from '../../value-objects/error';

describe('numberUtils', () => {
  describe('toBigInt', () => {
    it('should convert safe integers to bigint', () => {
      expect(numberUtils.toBigInt(42)).toBe(42n);
      expect(numberUtils.toBigInt(0)).toBe(0n);
      expect(numberUtils.toBigInt(-42)).toBe(-42n);
      expect(numberUtils.toBigInt(Number.MAX_SAFE_INTEGER)).toBe(
        BigInt(Number.MAX_SAFE_INTEGER)
      );
    });

    it('should convert strings to bigint safely up to arbitrary sizes', () => {
      expect(numberUtils.toBigInt('42')).toBe(42n);
      expect(numberUtils.toBigInt('-42')).toBe(-42n);
      expect(numberUtils.toBigInt('900719925474099234')).toBe(
        900719925474099234n
      );
    });

    it('should accept bigints', () => {
      expect(numberUtils.toBigInt(42n)).toBe(42n);
    });

    it('should reject floats', () => {
      expect(() => numberUtils.toBigInt(42.5)).toThrow(
        new AppError('Value must not be a float', { cause: 42.5 })
      );
      expect(() => numberUtils.toBigInt('42.5')).toThrow(
        new AppError('Value must not be a float', { cause: '42.5' })
      );
    });

    it('should reject invalid strings', () => {
      expect(() => numberUtils.toBigInt('abc')).toThrow(
        new AppError('Invalid value', { cause: 'abc' })
      );
      expect(() => numberUtils.toBigInt('')).toThrow(
        new AppError('Invalid value', { cause: '' })
      );
      expect(() => numberUtils.toBigInt('   ')).toThrow(
        new AppError('Invalid value', { cause: '   ' })
      );
    });

    it('should reject NaN', () => {
      expect(() => numberUtils.toBigInt(NaN)).toThrow(
        new AppError('Invalid value', { cause: NaN })
      );
    });
  });

  describe('toFloat', () => {
    it('should convert numbers', () => {
      expect(numberUtils.toFloat(42)).toBe(42);
      expect(numberUtils.toFloat(42.5)).toBe(42.5);
    });

    it('should convert strings', () => {
      expect(numberUtils.toFloat('42')).toBe(42);
      expect(numberUtils.toFloat('42.5')).toBe(42.5);
    });

    it('should convert bigints', () => {
      expect(numberUtils.toFloat(42n)).toBe(42);
    });

    it('should reject empty strings', () => {
      expect(() => numberUtils.toFloat('')).toThrow(
        new AppError('Invalid value', { cause: '' })
      );
      expect(() => numberUtils.toFloat('   ')).toThrow(
        new AppError('Invalid value', { cause: '   ' })
      );
    });

    it('should reject invalid values', () => {
      expect(() => numberUtils.toFloat('abc')).toThrow(
        new AppError('Invalid value', { cause: 'abc' })
      );
      expect(() => numberUtils.toFloat(NaN)).toThrow(
        new AppError('Invalid value', { cause: NaN })
      );
    });
  });

  describe('toNonNegativeNumber', () => {
    it('should convert non-negative numbers', () => {
      expect(numberUtils.toNonNegativeNumber(42)).toBe(42);
      expect(numberUtils.toNonNegativeNumber(42.5)).toBe(42.5);
      expect(numberUtils.toNonNegativeNumber(0)).toBe(0);
    });

    it('should convert non-negative strings', () => {
      expect(numberUtils.toNonNegativeNumber('42')).toBe(42);
      expect(numberUtils.toNonNegativeNumber('0')).toBe(0);
    });

    it('should reject negative values', () => {
      expect(() => numberUtils.toNonNegativeNumber(-1)).toThrow(
        new AppError('Value must not be negative', { cause: -1 })
      );
      expect(() => numberUtils.toNonNegativeNumber('-1')).toThrow(
        new AppError('Value must not be negative', { cause: '-1' })
      );
      expect(() => numberUtils.toNonNegativeNumber(-1n)).toThrow(
        new AppError('Value must not be negative', { cause: -1n })
      );
    });
  });

  describe('toFactor', () => {
    it('should convert integers', () => {
      expect(numberUtils.toFactor(42)).toEqual({
        numerator: 42,
        denominator: 1,
      });
      expect(numberUtils.toFactor('42')).toEqual({
        numerator: 42,
        denominator: 1,
      });
      expect(numberUtils.toFactor(42n)).toEqual({
        numerator: 42,
        denominator: 1,
      });
    });

    it('should convert floats with precise fractions', () => {
      expect(numberUtils.toFactor(1.5)).toEqual({
        numerator: 15,
        denominator: 10,
      });
      expect(numberUtils.toFactor('1.05')).toEqual({
        numerator: 105,
        denominator: 100,
      });
      expect(numberUtils.toFactor(-1.5)).toEqual({
        numerator: -15,
        denominator: 10,
      });
    });

    it('should handle scientific notation gracefully', () => {
      expect(numberUtils.toFactor('1e-3')).toEqual({
        numerator: 1,
        denominator: 1000,
      });
      expect(numberUtils.toFactor('1.5e-2')).toEqual({
        numerator: 15,
        denominator: 1000,
      });
      expect(numberUtils.toFactor('1.5e2')).toEqual({
        numerator: 150,
        denominator: 1,
      });
    });

    it('should handle Javascript Number.toString scientific conversions', () => {
      expect(numberUtils.toFactor(1e-7)).toEqual({
        numerator: 1,
        denominator: 10000000,
      });
    });

    it('should reject infinity and NaN', () => {
      expect(() => numberUtils.toFactor(Infinity)).toThrow(
        new AppError('Invalid value', { cause: Infinity })
      );
      expect(() => numberUtils.toFactor(NaN)).toThrow(
        new AppError('Invalid value', { cause: NaN })
      );
    });
  });
});
