import mockCurrencies from '../__mocks__/currencies.mock';
import currency from '../currency.vo';

describe('Currency Value Object', () => {
  describe('isValidCode', () => {
    it('should return true for valid currency codes', () => {
      expect(currency.isValidCode('NGN')).toBe(true);
      expect(currency.isValidCode('USD')).toBe(true);
      expect(currency.isValidCode('CAD')).toBe(true);
      expect(currency.isValidCode('EUR')).toBe(true);
      expect(currency.isValidCode('GBP')).toBe(true);
      expect(currency.isValidCode('JPY')).toBe(true);
    });

    it('should return false for invalid currency codes', () => {
      expect(currency.isValidCode('xyz')).toBe(false);
      expect(currency.isValidCode('')).toBe(false);
      expect(currency.isValidCode('NGN ')).toBe(false);
      expect(currency.isValidCode('ngn')).toBe(false);
      expect(currency.isValidCode('123')).toBe(false);
    });
  });

  describe('isValidMinorUnit', () => {
    it('should return true for valid minor units (integers between 0 and 8)', () => {
      for (let i = 0; i <= 8; i++) {
        expect(currency.isValidMinorUnit(i)).toBe(true);
      }
    });

    it('should return false for invalid minor units', () => {
      expect(currency.isValidMinorUnit(-1)).toBe(false);
      expect(currency.isValidMinorUnit(9)).toBe(false);
      expect(currency.isValidMinorUnit(100)).toBe(false);
      expect(currency.isValidMinorUnit(2.5)).toBe(false);
      expect(currency.isValidMinorUnit(NaN)).toBe(false);
      expect(currency.isValidMinorUnit(Infinity)).toBe(false);
      expect(currency.isValidMinorUnit(-Infinity)).toBe(false);
    });
  });

  describe('currency properties', () => {
    it('should contain known currency definitions', () => {
      expect(mockCurrencies.NGN).toBeDefined();
      expect(mockCurrencies.NGN.code).toBe('NGN');
      expect(mockCurrencies.NGN.symbol).toBe('₦');
      expect(mockCurrencies.NGN.name).toBe('Naira');
      expect(mockCurrencies.NGN.minorUnit).toBe(2n);

      expect(mockCurrencies.USD).toBeDefined();
      expect(mockCurrencies.USD.code).toBe('USD');
      expect(mockCurrencies.USD.symbol).toBe('$');

      expect(mockCurrencies.JPY).toBeDefined();
      expect(mockCurrencies.JPY.code).toBe('JPY');
      expect(mockCurrencies.JPY.minorUnit).toBe(0n);
    });

    it('should be frozen to prevent modifications', () => {
      expect(Object.isFrozen(currency)).toBe(true);
    });
  });
});
