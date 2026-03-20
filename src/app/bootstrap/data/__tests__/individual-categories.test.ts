import { SYSTEM_CATEGORIES_INDIVIDUAL } from '../system-categories-individual';
import { SYSTEM_PERSONAL_TAX_KEYS } from '../../../../domain/tax/policies/personal-income-tax/categorizations';
import { ECategoryType } from '../../../../domain/category/types/category.types';
import taxKeyValue from '../../../../domain/tax/value-objects/tax-keys.vo';

describe('SYSTEM_CATEGORIES_INDIVIDUAL', () => {
  it('should export an array of individual categories', () => {
    expect(Array.isArray(SYSTEM_CATEGORIES_INDIVIDUAL)).toBe(true);
    expect(SYSTEM_CATEGORIES_INDIVIDUAL.length).toBeGreaterThan(0);
  });

  it('should have correct base properties for all categories', () => {
    SYSTEM_CATEGORIES_INDIVIDUAL.forEach((category) => {
      expect(category.accountingDomain).toBe('individual');
      expect(category.status).toBe('active');
      expect(category.createdBy).toBeNull();
      expect(category.deletedAt).toBeNull();
      expect(category.parentId).toBeNull();
      expect(category.id).toBeDefined();
      expect(typeof category.id).toBe('string');
      expect(category.name).toBeDefined();
      expect(typeof category.name).toBe('string');
      expect(category.description).toBeDefined();
      expect(typeof category.description).toBe('string');
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(category.updatedAt).toBeInstanceOf(Date);
    });
  });

  it('should have unique IDs', () => {
    const ids = SYSTEM_CATEGORIES_INDIVIDUAL.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should include all fully deductible categories', () => {
    const values = Object.values(SYSTEM_PERSONAL_TAX_KEYS.deductibleFully);
    values.forEach((taxKey) => {
      const category = SYSTEM_CATEGORIES_INDIVIDUAL.find(
        (c) => c.taxKey === taxKey
      );
      expect(category).toBeDefined();
      expect(category?.type).toBe(ECategoryType.Payment);
    });
  });

  it('should include all partly deductible categories', () => {
    const values = Object.values(SYSTEM_PERSONAL_TAX_KEYS.deductiblePartly);
    values.forEach((taxKey) => {
      const category = SYSTEM_CATEGORIES_INDIVIDUAL.find(
        (c) => c.taxKey === taxKey
      );
      expect(category).toBeDefined();
      expect(category?.type).toBe(ECategoryType.Expense);
    });
  });

  it('should include all fully exempt categories', () => {
    const values = Object.values(SYSTEM_PERSONAL_TAX_KEYS.exemptFully);
    values.forEach((taxKey) => {
      const category = SYSTEM_CATEGORIES_INDIVIDUAL.find(
        (c) => c.taxKey === taxKey
      );
      expect(category).toBeDefined();
      expect(category?.type).toBe(ECategoryType.Receipt);
    });
  });

  it('should include all partly exempt categories', () => {
    const values = Object.values(SYSTEM_PERSONAL_TAX_KEYS.exemptPartly);
    values.forEach((taxKey) => {
      const category = SYSTEM_CATEGORIES_INDIVIDUAL.find(
        (c) => c.taxKey === taxKey
      );
      expect(category).toBeDefined();
      expect(category?.type).toBe(ECategoryType.Receipt);
    });
  });

  it('should include all WHT applicable categories', () => {
    const values = Object.values(SYSTEM_PERSONAL_TAX_KEYS.whtApplicable);
    values.forEach((taxKey) => {
      const category = SYSTEM_CATEGORIES_INDIVIDUAL.find(
        (c) => c.taxKey === taxKey
      );
      expect(category).toBeDefined();
      expect(category?.type).toBe(ECategoryType.Receipt);
    });
  });

  it('should include all prompt trigger expenses categories', () => {
    const values = Object.values(
      SYSTEM_PERSONAL_TAX_KEYS.promptTriggersExpenses
    );
    values.forEach((taxKey) => {
      const category = SYSTEM_CATEGORIES_INDIVIDUAL.find(
        (c) => c.taxKey === taxKey
      );
      expect(category).toBeDefined();
      expect(category?.type).toBe(ECategoryType.Expense);
    });
  });

  it('should include all prompt trigger payment categories', () => {
    const values = Object.values(
      SYSTEM_PERSONAL_TAX_KEYS.promptTriggersPayment
    );
    values.forEach((taxKey) => {
      const category = SYSTEM_CATEGORIES_INDIVIDUAL.find(
        (c) => c.taxKey === taxKey
      );
      expect(category).toBeDefined();
      expect(category?.type).toBe(ECategoryType.Payment);
    });
  });

  it('should include all prompt trigger receipt categories', () => {
    const values = Object.values(
      SYSTEM_PERSONAL_TAX_KEYS.promptTriggersReceipt
    );
    values.forEach((taxKey) => {
      const category = SYSTEM_CATEGORIES_INDIVIDUAL.find(
        (c) => c.taxKey === taxKey
      );
      expect(category).toBeDefined();
      expect(category?.type).toBe(ECategoryType.Receipt);
    });
  });

  it('should include default others categories for all transaction types', () => {
    Object.values(ECategoryType).forEach((type) => {
      const expectedTaxKey = taxKeyValue.make(type as any);
      const category = SYSTEM_CATEGORIES_INDIVIDUAL.find(
        (c) => c.taxKey === expectedTaxKey
      );
      expect(category).toBeDefined();
      expect(category?.type).toBe(type);
    });
  });
});
