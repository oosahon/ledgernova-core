import accountEntity from './account.entity';
import {
  ELedgerAccountType,
  EAccountStatus,
  IAccount,
} from '../types/account.types';
import currencyValue from '../../../shared/value-objects/currency.vo';
import moneyValue from '../../../shared/value-objects/money.vo';
import { AppError } from '../../../shared/value-objects/error';

describe('account.entity.ts', () => {
  const validUserId = 'test-user-id';
  const usdCurrency = currencyValue.value.USD;

  function createValidPayload(overrides?: any) {
    return {
      userId: validUserId,
      name: '  Valid Name  ',
      type: ELedgerAccountType.Asset,
      currencyCode: 'USD',
      status: EAccountStatus.Active,
      ...overrides,
    };
  }

  describe('make', () => {
    it('should create an account with valid payload', () => {
      const payload = createValidPayload();
      const account = accountEntity.make(payload);

      expect(account.id).toBeDefined();
      expect(typeof account.id).toBe('string');
      expect(account.userId).toBe(validUserId);
      expect(account.name).toBe('Valid Name');
      expect(account.type).toBe(ELedgerAccountType.Asset);
      expect(account.subType).toBeNull();
      expect(account.currencyCode).toBe('USD');
      expect(account.status).toBe(EAccountStatus.Active);
      expect(account.createdAt).toBeInstanceOf(Date);
      expect(account.updatedAt).toBeInstanceOf(Date);
      expect(account.deletedAt).toBeNull();
    });

    it('should create an account with valid subType payload', () => {
      const payload = createValidPayload({
        type: ELedgerAccountType.Liability,
        subType: '  My SubType  ',
      });
      const account = accountEntity.make(payload);
      expect(account.subType).toBe('My SubType');
    });

    it('should throw "Invalid currency code" on invalid currency', () => {
      const payload = createValidPayload({ currencyCode: 'INVALID' });
      let error: any;
      try {
        accountEntity.make(payload);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid currency code');
      expect(error.cause).toEqual({ cause: payload });
    });

    describe('sanitizeName branches', () => {
      it('should throw if name is not a string', () => {
        let error: any;
        try {
          accountEntity.make(createValidPayload({ name: 123 }));
        } catch (err) {
          error = err;
        }
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Invalid account name');
        expect(error.cause).toEqual({ cause: 123 });
      });

      it('should throw if name is an empty string after trim', () => {
        let error: any;
        try {
          accountEntity.make(createValidPayload({ name: '   ' }));
        } catch (err) {
          error = err;
        }
        expect(error.message).toBe('Invalid account name');
      });

      it('should throw if name length > 100', () => {
        const longStr = 'A'.repeat(101);
        let error: any;
        try {
          accountEntity.make(createValidPayload({ name: longStr }));
        } catch (err) {
          error = err;
        }
        expect(error.message).toBe('Invalid account name');
      });
    });

    describe('sanitizeSubType branches', () => {
      it('should throw if subType is not a string (and not falsy)', () => {
        let error: any;
        try {
          accountEntity.make(createValidPayload({ subType: 123 }));
        } catch (err) {
          error = err;
        }
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Invalid account sub type');
        expect(error.cause).toEqual({ cause: 123 });
      });

      it('should throw if subType is an empty string after trim', () => {
        let error: any;
        try {
          accountEntity.make(createValidPayload({ subType: '   ' }));
        } catch (err) {
          error = err;
        }
        expect(error.message).toBe('Invalid account sub type');
      });

      it('should throw if subType is too long', () => {
        const longStr = 'B'.repeat(101);
        let error: any;
        try {
          accountEntity.make(createValidPayload({ subType: longStr }));
        } catch (err) {
          error = err;
        }
        expect(error.message).toBe('Invalid account sub type');
      });
    });
  });

  describe('getBalance', () => {
    it('calculates Asset balance (debit - credit)', () => {
      const balance = accountEntity.getBalance({
        type: ELedgerAccountType.Asset,
        totalCredit: moneyValue.make(100, usdCurrency, false), // 100 USD = 10000 minorUnits
        totalDebit: moneyValue.make(300, usdCurrency, false), // 300 USD = 30000 minorUnits
      });
      // 30000 - 10000 = 20000
      expect(balance?.amount).toBe(20000n);
    });

    it('calculates Expense balance (debit - credit)', () => {
      const balance = accountEntity.getBalance({
        type: ELedgerAccountType.Expense,
        totalCredit: moneyValue.make(100, usdCurrency, false),
        totalDebit: moneyValue.make(400, usdCurrency, false),
      });
      expect(balance?.amount).toBe(30000n);
    });

    it('calculates Liability balance (credit - debit)', () => {
      const balance = accountEntity.getBalance({
        type: ELedgerAccountType.Liability,
        totalCredit: moneyValue.make(500, usdCurrency, false),
        totalDebit: moneyValue.make(200, usdCurrency, false),
      });
      // 50000 - 20000 = 30000
      expect(balance?.amount).toBe(30000n);
    });

    it('calculates Equity balance (credit - debit)', () => {
      const balance = accountEntity.getBalance({
        type: ELedgerAccountType.Equity,
        totalCredit: moneyValue.make(200, usdCurrency, false),
        totalDebit: moneyValue.make(500, usdCurrency, false),
      });
      expect(balance?.amount).toBe(-30000n);
    });

    it('calculates Revenue balance (credit - debit)', () => {
      const balance = accountEntity.getBalance({
        type: ELedgerAccountType.Revenue,
        totalCredit: moneyValue.make(100, usdCurrency, false),
        totalDebit: moneyValue.make(0, usdCurrency, false),
      });
      expect(balance?.amount).toBe(10000n);
    });
  });

  describe('update', () => {
    let baseAccount: IAccount;

    beforeEach(() => {
      baseAccount = accountEntity.make(
        createValidPayload({ name: 'Original' })
      );
    });

    it('updates properties and timestamps if payloads are valid', () => {
      // Need fake timers to properly catch timestamp modifications
      jest.useFakeTimers();
      const newTime = new Date(baseAccount.updatedAt.getTime() + 10000);
      jest.setSystemTime(newTime);

      const payload = {
        name: ' New Name ',
        subType: ' New SubType ',
        currencyCode: 'EUR',
      };

      const updated = accountEntity.update(baseAccount, payload);

      expect(updated.name).toBe('New Name');
      expect(updated.subType).toBe('New SubType');
      expect(updated.currencyCode).toBe('EUR');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(
        baseAccount.updatedAt.getTime()
      );

      jest.useRealTimers();
    });

    it('preserves existing properties if payload keys are missing/undefined', () => {
      let accWithSubtype = accountEntity.make(
        createValidPayload({ subType: 'Original SubType' })
      );

      const updated = accountEntity.update(accWithSubtype, {
        name: undefined as any,
        subType: undefined,
        currencyCode: undefined as any,
      });

      expect(updated.name).toBe(accWithSubtype.name);
      expect(updated.subType).toBe('Original SubType');
      expect(updated.currencyCode).toBe('USD');
    });

    it('throws if invalid currency code is provided', () => {
      let error: any;
      try {
        accountEntity.update(baseAccount, { currencyCode: 'INVALID' } as any);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid currency code');
    });
  });

  describe('archive', () => {
    it('sets status to archived and updates timestamp', () => {
      const baseAccount = accountEntity.make(
        createValidPayload({ name: 'Original' })
      );

      jest.useFakeTimers();
      jest.setSystemTime(new Date(baseAccount.updatedAt.getTime() + 10000));

      const archived = accountEntity.archive(baseAccount);

      expect(archived.status).toBe(EAccountStatus.Archived);
      expect(archived.updatedAt.getTime()).toBeGreaterThan(
        baseAccount.updatedAt.getTime()
      );

      jest.useRealTimers();
    });
  });

  describe('unarchive', () => {
    it('sets status to active and updates timestamp', () => {
      let baseAccount = accountEntity.make(
        createValidPayload({ name: 'Original' })
      );
      baseAccount = accountEntity.archive(baseAccount);

      jest.useFakeTimers();
      jest.setSystemTime(new Date(baseAccount.updatedAt.getTime() + 10000));

      const unArchived = accountEntity.unarchive(baseAccount);

      expect(unArchived.status).toBe(EAccountStatus.Active);
      expect(unArchived.updatedAt.getTime()).toBeGreaterThan(
        baseAccount.updatedAt.getTime()
      );

      jest.useRealTimers();
    });
  });
});
