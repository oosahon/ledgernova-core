import ledgerAccountEntity from '../ledger-account.entity';
import {
  ELedgerAccountType,
  EAccountStatus,
  ILedgerAccount,
} from '../../types/ledger-account.types';
import { EAccountEvents } from '../../events/ledger-account.events';
import moneyValue from '../../../../shared/value-objects/money.vo';
import { AppError } from '../../../../shared/value-objects/error';
import mockCurrencies from '../../../../shared/value-objects/__mocks__/currencies.mock';

describe('ledger-account.entity.ts', () => {
  const validUserId = 'test-user-id';
  const usdCurrency = mockCurrencies.USD;

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
      const [account, events] = ledgerAccountEntity.make(payload);

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
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe(EAccountEvents.Created);
      expect(events[0].event.data).toEqual(account);
    });

    it('should create an account with valid subType payload', () => {
      const payload = createValidPayload({
        type: ELedgerAccountType.Liability,
        subType: '  My SubType  ',
      });
      const [account, events] = ledgerAccountEntity.make(payload);
      expect(account.subType).toBe('My SubType');
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe(EAccountEvents.Created);
      expect(events[0].event.data).toEqual(account);
    });

    it('should throw "Invalid currency code" on invalid currency', () => {
      const payload = createValidPayload({ currencyCode: 'INVALID' });
      let error: any;
      try {
        ledgerAccountEntity.make(payload);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid currency code');
      expect(error.cause).toEqual({ cause: 'INVALID' });
    });

    describe('sanitizeName branches', () => {
      it('should throw if name is not a string', () => {
        let error: any;
        try {
          ledgerAccountEntity.make(createValidPayload({ name: 123 }));
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
          ledgerAccountEntity.make(createValidPayload({ name: '   ' }));
        } catch (err) {
          error = err;
        }
        expect(error.message).toBe('Invalid account name');
      });

      it('should throw if name length > 100', () => {
        const longStr = 'A'.repeat(101);
        let error: any;
        try {
          ledgerAccountEntity.make(createValidPayload({ name: longStr }));
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
          ledgerAccountEntity.make(createValidPayload({ subType: 123 }));
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
          ledgerAccountEntity.make(createValidPayload({ subType: '   ' }));
        } catch (err) {
          error = err;
        }
        expect(error.message).toBe('Invalid account sub type');
      });

      it('should throw if subType is too long', () => {
        const longStr = 'B'.repeat(101);
        let error: any;
        try {
          ledgerAccountEntity.make(createValidPayload({ subType: longStr }));
        } catch (err) {
          error = err;
        }
        expect(error.message).toBe('Invalid account sub type');
      });
    });
  });

  describe('getBalance', () => {
    it('calculates Asset balance (debit - credit)', () => {
      const balance = ledgerAccountEntity.getBalance({
        type: ELedgerAccountType.Asset,
        totalCredit: moneyValue.make(100, usdCurrency, false), // 100 USD = 10000 minorUnits
        totalDebit: moneyValue.make(300, usdCurrency, false), // 300 USD = 30000 minorUnits
      });
      // 30000 - 10000 = 20000
      expect(balance?.amount).toBe(20000n);
    });

    it('calculates Expense balance (debit - credit)', () => {
      const balance = ledgerAccountEntity.getBalance({
        type: ELedgerAccountType.Expense,
        totalCredit: moneyValue.make(100, usdCurrency, false),
        totalDebit: moneyValue.make(400, usdCurrency, false),
      });
      expect(balance?.amount).toBe(30000n);
    });

    it('calculates Liability balance (credit - debit)', () => {
      const balance = ledgerAccountEntity.getBalance({
        type: ELedgerAccountType.Liability,
        totalCredit: moneyValue.make(500, usdCurrency, false),
        totalDebit: moneyValue.make(200, usdCurrency, false),
      });
      // 50000 - 20000 = 30000
      expect(balance?.amount).toBe(30000n);
    });

    it('calculates Equity balance (credit - debit)', () => {
      const balance = ledgerAccountEntity.getBalance({
        type: ELedgerAccountType.Equity,
        totalCredit: moneyValue.make(200, usdCurrency, false),
        totalDebit: moneyValue.make(500, usdCurrency, false),
      });
      expect(balance?.amount).toBe(-30000n);
    });

    it('calculates Revenue balance (credit - debit)', () => {
      const balance = ledgerAccountEntity.getBalance({
        type: ELedgerAccountType.Revenue,
        totalCredit: moneyValue.make(100, usdCurrency, false),
        totalDebit: moneyValue.make(0, usdCurrency, false),
      });
      expect(balance?.amount).toBe(10000n);
    });
  });

  describe('update', () => {
    let baseAccount: ILedgerAccount;

    beforeEach(() => {
      [baseAccount] = ledgerAccountEntity.make(
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

      const [updated, events] = ledgerAccountEntity.update(
        baseAccount,
        payload
      );

      expect(updated.name).toBe('New Name');
      expect(updated.subType).toBe('New SubType');
      expect(updated.currencyCode).toBe('EUR');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(
        baseAccount.updatedAt.getTime()
      );
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe(EAccountEvents.Updated);
      expect(events[0].event.data).toEqual(baseAccount);

      jest.useRealTimers();
    });

    it('preserves existing properties if payload keys are missing/undefined', () => {
      let [accWithSubtype] = ledgerAccountEntity.make(
        createValidPayload({ subType: 'Original SubType' })
      );

      const [updated, events] = ledgerAccountEntity.update(accWithSubtype, {
        name: undefined as any,
        subType: undefined,
        currencyCode: undefined as any,
      });

      expect(updated.name).toBe(accWithSubtype.name);
      expect(updated.subType).toBe('Original SubType');
      expect(updated.currencyCode).toBe('USD');
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe(EAccountEvents.Updated);
      expect(events[0].event.data).toEqual(accWithSubtype);
    });

    it('throws if invalid currency code is provided', () => {
      let error: any;
      try {
        ledgerAccountEntity.update(baseAccount, {
          currencyCode: 'INVALID',
        } as any);
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid currency code');
    });
  });

  describe('archive', () => {
    it('sets status to archived and updates timestamp', () => {
      const [baseAccount] = ledgerAccountEntity.make(
        createValidPayload({ name: 'Original' })
      );

      jest.useFakeTimers();
      jest.setSystemTime(new Date(baseAccount.updatedAt.getTime() + 10000));

      const [archived, events] = ledgerAccountEntity.archive(baseAccount);

      expect(archived.status).toBe(EAccountStatus.Archived);
      expect(archived.updatedAt.getTime()).toBeGreaterThan(
        baseAccount.updatedAt.getTime()
      );
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe(EAccountEvents.Archived);
      expect(events[0].event.data).toEqual(archived);

      jest.useRealTimers();
    });
  });

  describe('unarchive', () => {
    it('sets status to active and updates timestamp', () => {
      let [baseAccount] = ledgerAccountEntity.make(
        createValidPayload({ name: 'Original' })
      );
      [baseAccount] = ledgerAccountEntity.archive(baseAccount);

      jest.useFakeTimers();
      jest.setSystemTime(new Date(baseAccount.updatedAt.getTime() + 10000));

      const [unArchived, events] = ledgerAccountEntity.unarchive(baseAccount);

      expect(unArchived.status).toBe(EAccountStatus.Active);
      expect(unArchived.updatedAt.getTime()).toBeGreaterThan(
        baseAccount.updatedAt.getTime()
      );
      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe(EAccountEvents.Unarchived);
      expect(events[0].event.data).toEqual(unArchived);

      jest.useRealTimers();
    });
  });
});
