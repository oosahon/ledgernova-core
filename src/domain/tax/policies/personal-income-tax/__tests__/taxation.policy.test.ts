import { AppError } from '../../../../../shared/value-objects/error';
import moneyValue from '../../../../../shared/value-objects/money.vo';
import { ITransactionItemWithPromptResponse } from '../../../types/personal-income-tax.types';
import taxationPolicy from '../taxation-policy';
import { SYSTEM_PERSONAL_TAX_KEYS } from '../categorizations';

describe('Nigeria Tax Act (NTA) 2025 Taxation Policy', () => {
  const currency = {
    code: 'NGN',
    minorUnit: 2n,
    symbol: '₦',
    name: 'Naira',
  };

  const createItem = (
    taxKey: string,
    amountValue: number,
    individualTaxPromptResponse?: any
  ): ITransactionItemWithPromptResponse => {
    return {
      category: {
        taxKey,
      },
      functionalCurrencyAmount: moneyValue.make(amountValue, currency, false),
      ...(individualTaxPromptResponse ? { individualTaxPromptResponse } : {}),
    } as unknown as ITransactionItemWithPromptResponse;
  };

  describe('genericTaxable', () => {
    it('should throw an error if no transaction items are provided', () => {
      expect(() => taxationPolicy.genericTaxable([])).toThrow(AppError);
    });

    it('should properly filter out excluded keys from COMBINED keys and calculate totals', () => {
      const exemptItem = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptFully.gift,
        1000
      );
      const normalIncome = createItem('personal:receipt:salary', 50000);
      const anotherIncome = createItem('personal:receipt:bonus', 15000);

      const items = [exemptItem, normalIncome, anotherIncome];

      const result = taxationPolicy.genericTaxable(items);

      expect(result.transactionItems).toHaveLength(2);
      expect(result.transactionItems).not.toContain(exemptItem);
      expect(result.totalAmount).toEqual(
        moneyValue.make(65000, currency, false)
      );
      expect(result.taxableAmount).toEqual(
        moneyValue.make(65000, currency, false)
      );
      expect(result.taxCredits).toEqual(moneyValue.make(0, currency, false));
      expect(result.withholdingTax).toEqual(
        moneyValue.make(0, currency, false)
      );
    });

    it('should return zeros if all items are excluded', () => {
      const exemptItem = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptFully.gift,
        1000
      );
      const result = taxationPolicy.genericTaxable([exemptItem]);

      expect(result.transactionItems).toHaveLength(0);
      expect(result.totalAmount).toEqual(moneyValue.make(0, currency, false));
      expect(result.taxableAmount).toEqual(moneyValue.make(0, currency, false));
      expect(result.taxCredits).toEqual(moneyValue.make(0, currency, false));
      expect(result.withholdingTax).toEqual(
        moneyValue.make(0, currency, false)
      );
    });
  });

  describe('fullyExempt', () => {
    it('should throw an error if no transaction items are provided', () => {
      expect(() => taxationPolicy.fullyExempt([])).toThrow(AppError);
    });

    it('should properly calculate totals for fully exempt items', () => {
      const gift1 = createItem(SYSTEM_PERSONAL_TAX_KEYS.exemptFully.gift, 5000);
      const taxRefund = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptFully.taxRefund,
        2000
      );
      const normalIncome = createItem('personal:receipt:salary', 10000);

      const result = taxationPolicy.fullyExempt([
        gift1,
        taxRefund,
        normalIncome,
      ]);

      expect(result.transactionItems).toHaveLength(2);
      expect(result.totalAmount).toEqual(
        moneyValue.make(7000, currency, false)
      );
      expect(result.taxableAmount).toEqual(moneyValue.make(0, currency, false)); // 7000 - 7000
    });

    it('should handle missing items returning zero', () => {
      const normalIncome = createItem('personal:receipt:salary', 10000);
      const result = taxationPolicy.fullyExempt([normalIncome]);

      expect(result.transactionItems).toHaveLength(0);
      expect(result.totalAmount).toEqual(moneyValue.make(0, currency, false));
      expect(result.taxableAmount).toEqual(moneyValue.make(0, currency, false));
    });
  });

  describe('personalEffectSale', () => {
    it('should throw an error if no transaction items are provided', () => {
      expect(() => taxationPolicy.personalEffectSale([])).toThrow(AppError);
    });

    it('should calculate zero taxable amount if total is under 5,000,000', () => {
      const sale1 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfPersonalEffects,
        2000000
      );
      const sale2 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfPersonalEffects,
        1500000
      );
      const other = createItem('personal:receipt:other', 1000);

      const result = taxationPolicy.personalEffectSale([sale1, sale2, other]);

      expect(result.transactionItems).toHaveLength(2);
      expect(result.totalAmount).toEqual(
        moneyValue.make(3500000, currency, false)
      );
      expect(result.taxableAmount).toEqual(moneyValue.make(0, currency, false));
    });

    it('should calculate excess taxable amount if total exceeds 5,000,000', () => {
      const sale1 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfPersonalEffects,
        4000000
      );
      const sale2 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfPersonalEffects,
        3500000
      );

      const result = taxationPolicy.personalEffectSale([sale1, sale2]);

      expect(result.transactionItems).toHaveLength(2);
      expect(result.totalAmount).toEqual(
        moneyValue.make(7500000, currency, false)
      );
      expect(result.taxableAmount).toEqual(
        moneyValue.make(2500000, currency, false)
      );
    });
  });

  describe('personalVehicleSale', () => {
    it('should throw an error if no transaction items are provided', () => {
      expect(() => taxationPolicy.personalVehicleSale([])).toThrow(AppError);
    });

    it('should return completely zeroed response if no applicable items exist', () => {
      const normalIncome = createItem('personal:receipt:salary', 10000);
      const result = taxationPolicy.personalVehicleSale([normalIncome]);

      expect(result.transactionItems).toHaveLength(0);
      expect(result.totalAmount).toEqual(moneyValue.make(0, currency, false));
      expect(result.taxableAmount).toEqual(moneyValue.make(0, currency, false));
    });

    it('should return zero taxable amount if fewer than 3 vehicles are sold', () => {
      const vehicle1 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfVehicles,
        1500000
      );
      const vehicle2 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfVehicles,
        2000000
      );

      const result = taxationPolicy.personalVehicleSale([vehicle1, vehicle2]);

      expect(result.transactionItems).toHaveLength(2);
      expect(result.totalAmount).toEqual(
        moneyValue.make(3500000, currency, false)
      );
      expect(result.taxableAmount).toEqual(moneyValue.make(0, currency, false));
    });

    it('should tax the remainder after exempting the top two most expensive vehicles', () => {
      const vehicle1 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfVehicles,
        1000000
      );
      const vehicle2 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfVehicles,
        3000000
      );
      const vehicle3 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfVehicles,
        500000
      );
      const vehicle4 = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.exemptPartly.saleOfVehicles,
        2000000
      );

      // Top 2: 3,000,000 and 2,000,000. Sum: 5,000,000
      // Total: 6,500,000
      // Taxable: 1,500,000

      const result = taxationPolicy.personalVehicleSale([
        vehicle1,
        vehicle2,
        vehicle3,
        vehicle4,
      ]);

      expect(result.transactionItems).toHaveLength(4);
      expect(result.totalAmount).toEqual(
        moneyValue.make(6500000, currency, false)
      );
      expect(result.taxableAmount).toEqual(
        moneyValue.make(1500000, currency, false)
      );
    });
  });

  describe('finalWithholdingTaxAPolicy', () => {
    it('should throw an error if no transaction items are provided', () => {
      expect(() => taxationPolicy.finalWithholdingTaxAPolicy([])).toThrow(
        AppError
      );
    });

    it('should return fully zeroed response if no applicable items', () => {
      const normalIncome = createItem('personal:receipt:salary', 10000);
      const result = taxationPolicy.finalWithholdingTaxAPolicy([normalIncome]);

      expect(result.transactionItems).toHaveLength(0);
      expect(result.totalAmount).toEqual(moneyValue.make(0, currency, false));
      expect(result.taxableAmount).toEqual(moneyValue.make(0, currency, false));
      expect(result.withholdingTax).toEqual(
        moneyValue.make(0, currency, false)
      );
    });

    it('should calculate WHT correctly dividing by 0.9 to find the gross for final WHT and set taxableAmount to zero', () => {
      // 900 Net implies 1000 Gross, so WHT is 100.
      const royaltyItem = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.royalties,
        900
      );
      const dividendItem = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.dividends,
        1800
      );
      // Total Net: 2700. Gross is 3000. WHT is 300.

      const result = taxationPolicy.finalWithholdingTaxAPolicy([
        royaltyItem,
        dividendItem,
      ]);

      expect(result.transactionItems).toHaveLength(2);
      expect(result.totalAmount).toEqual(
        moneyValue.make(2700, currency, false)
      );
      expect(result.taxableAmount).toEqual(moneyValue.make(0, currency, false));
      expect(result.withholdingTax).toEqual(
        moneyValue.make(300, currency, false)
      );
      expect(result.taxCredits).toEqual(moneyValue.make(0, currency, false));
    });
  });

  describe('nonFinalWithholdingTaxAPolicy', () => {
    it('should throw an error if no transaction items are provided', () => {
      expect(() => taxationPolicy.nonFinalWithholdingTaxAPolicy([])).toThrow(
        AppError
      );
    });

    it('should return fully zeroed response if no applicable items', () => {
      const normalIncome = createItem('personal:receipt:salary', 10000);
      const result = taxationPolicy.nonFinalWithholdingTaxAPolicy([
        normalIncome,
      ]);

      expect(result.transactionItems).toHaveLength(0);
      expect(result.totalAmount).toEqual(moneyValue.make(0, currency, false));
      expect(result.taxableAmount).toEqual(moneyValue.make(0, currency, false));
      expect(result.withholdingTax).toEqual(
        moneyValue.make(0, currency, false)
      );
    });

    it('should calculate WHT dividing by 0.9 and correctly set taxableAmount to gross and assign taxCredits', () => {
      // 4500 Net implies 5000 Gross, so WHT is 500.
      const rentalItem = createItem(
        SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.rentalToOrganization,
        4500
      );

      const result = taxationPolicy.nonFinalWithholdingTaxAPolicy([rentalItem]);

      expect(result.transactionItems).toHaveLength(1);
      expect(result.totalAmount).toEqual(
        moneyValue.make(4500, currency, false)
      );
      expect(result.taxableAmount).toEqual(
        moneyValue.make(5000, currency, false)
      ); // Gross Amount
      expect(result.withholdingTax).toEqual(
        moneyValue.make(500, currency, false)
      );
      expect(result.taxCredits).toEqual(moneyValue.make(500, currency, false));
    });
  });

  describe('getApplicable (Internal check via policy execution)', () => {
    it('should correctly strip user suffix off taxKey when filtering', () => {
      const rentItem = createItem(
        `${SYSTEM_PERSONAL_TAX_KEYS.whtApplicable.rentalToOrganization}::uuid123`,
        900
      );
      const items = [rentItem];

      const result = taxationPolicy.nonFinalWithholdingTaxAPolicy(items);
      expect(result.transactionItems).toHaveLength(1);
    });
  });
});
