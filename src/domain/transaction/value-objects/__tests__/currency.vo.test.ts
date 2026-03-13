import currency from '../currency.vo';

describe('Currency Value Object', () => {
  describe('isValidCurrencyCode', () => {
    it('should return true for valid currency codes', () => {
      expect(currency.isValidCurrencyCode('NGN')).toBe(true);
      expect(currency.isValidCurrencyCode('USD')).toBe(true);
      expect(currency.isValidCurrencyCode('CAD')).toBe(true);
      expect(currency.isValidCurrencyCode('EUR')).toBe(true);
      expect(currency.isValidCurrencyCode('GBP')).toBe(true);
      expect(currency.isValidCurrencyCode('JPY')).toBe(true);
    });

    it('should return false for invalid currency codes', () => {
      expect(currency.isValidCurrencyCode('xyz')).toBe(false);
      expect(currency.isValidCurrencyCode('')).toBe(false);
      expect(currency.isValidCurrencyCode('NGN ')).toBe(false);
      expect(currency.isValidCurrencyCode('ngn')).toBe(false);
      expect(currency.isValidCurrencyCode('123')).toBe(false);
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
      expect(currency.value.NGN).toBeDefined();
      expect(currency.value.NGN.code).toBe('NGN');
      expect(currency.value.NGN.symbol).toBe('₦');
      expect(currency.value.NGN.name).toBe('Naira');
      expect(currency.value.NGN.minorUnit).toBe(2n);

      expect(currency.value.USD).toBeDefined();
      expect(currency.value.USD.code).toBe('USD');
      expect(currency.value.USD.symbol).toBe('$');

      expect(currency.value.JPY).toBeDefined();
      expect(currency.value.JPY.code).toBe('JPY');
      expect(currency.value.JPY.minorUnit).toBe(0n);
    });

    it('should be frozen to prevent modifications', () => {
      expect(Object.isFrozen(currency)).toBe(true);
    });
  });
});
