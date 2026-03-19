import transactionEntity from '../transaction.entity';
import { ELedgerAccountType } from '../../../account/types/account.types';
import {
  ETransactionStatus,
  ETransactionType,
  ITransaction,
} from '../../types/transaction.types';
import moneyValue from '../../../../shared/value-objects/money.vo';
import categoryEntity from '../../../category/entities/category.entity';
import { AppError } from '../../../../shared/value-objects/error';
import { TCreationOmits } from '../../../../shared/types/creation-omits.types';
import { EAccountingDomain } from '../../../accounting/types/accounting.types';

describe('Transaction Entity', () => {
  const currency = {
    code: 'USD',
    minorUnit: 2n,
    symbol: '$',
    name: 'US Dollar',
  };

  const [baseCategory] = categoryEntity.make({
    name: 'Sales',
    transactionType: ETransactionType.Receipt,
    userId: null,
    parentId: null,
    description: 'Sales category',
    taxKey: 'sale:sales',
    accountingDomain: EAccountingDomain.Personal,
  });

  const validCategory = {
    ...baseCategory,
    taxKey: 'sale:sales',
  };

  const validItemPayload = {
    name: 'Item 1',
    amount: moneyValue.make(100, currency, false),
    functionalCurrencyAmount: moneyValue.make(100, currency, false),
    quantity: 1,
    unitPrice: moneyValue.make(100, currency, false),
    category: validCategory,
    isSystemGenerated: false,
  };

  const validTransactionPayload: TCreationOmits<ITransaction> = {
    status: ETransactionStatus.Pending,
    createdBy: 'user-1',
    type: ETransactionType.Sale,
    accountId: 'acc-1',
    amount: moneyValue.make(100, currency, false),
    functionalCurrencyAmount: moneyValue.make(100, currency, false),
    date: new Date('2024-01-01'),
    recipientAccountId: null,
    exchangeRate: 1,
    note: 'Test note',
    attachmentIds: [],
    items: [],
  };

  describe('make', () => {
    it('should create a valid transaction with items', () => {
      const [transaction, events] = transactionEntity.make(
        validTransactionPayload,
        [validItemPayload]
      );

      expect(transaction.id).toBeDefined();
      expect(transaction.status).toBe(validTransactionPayload.status);
      expect(transaction.createdBy).toBe(validTransactionPayload.createdBy);
      expect(transaction.type).toBe(validTransactionPayload.type);
      expect(transaction.accountId).toBe(validTransactionPayload.accountId);
      expect(transaction.amount).toEqual(validTransactionPayload.amount);
      expect(transaction.date).toBe(validTransactionPayload.date);
      expect(transaction.recipientAccountId).toBe(
        validTransactionPayload.recipientAccountId
      );
      expect(transaction.exchangeRate).toBe(
        validTransactionPayload.exchangeRate
      );
      expect(transaction.note).toBe(validTransactionPayload.note);

      expect(transaction.items).toBeDefined();
      expect(transaction.items?.length).toBe(1);
      const item = transaction.items![0];
      expect(item.name).toBe(validItemPayload.name);
      expect(item.amount).toEqual(validItemPayload.amount);
      expect(item.functionalCurrencyAmount).toEqual(
        validItemPayload.functionalCurrencyAmount
      );
      expect(item.transactionId).toBe(transaction.id); // Matches parent ID

      expect(events[0].event.type).toBe('domain:transaction:created');
      expect(events[0].event.data).toEqual({ ...transaction, items: null }); // Transaction event is created before items are added

      expect(events[1].event.type).toBe('domain:transaction_item:created');
      expect(events[1].event.data).toEqual(item);
    });

    it('should create a valid transfer transaction without items', () => {
      const transferPayload = {
        ...validTransactionPayload,
        type: ETransactionType.Transfer,
        recipientAccountId: 'acc-2',
      };

      const [transaction, events] = transactionEntity.make(transferPayload, []);

      expect(transaction.items).toBeNull();
      expect(transaction.type).toBe(ETransactionType.Transfer);
      expect(transaction.recipientAccountId).toBe('acc-2');

      expect(events[0].event.type).toBe('domain:transaction:created');
    });

    it('should create a valid journal transaction without items', () => {
      const journalPayload = {
        ...validTransactionPayload,
        type: ETransactionType.Journal,
      };

      const [transaction, events] = transactionEntity.make(journalPayload, []);

      expect(transaction.items).toBeNull();
      expect(transaction.type).toBe(ETransactionType.Journal);

      expect(events[0].event.type).toBe('domain:transaction:created');
    });

    it('should assign memo/note correctly', () => {
      const payload = {
        ...validTransactionPayload,
        note: '   A note   ',
      };
      const [transaction] = transactionEntity.make(payload, [validItemPayload]);
      expect(transaction.note).toBe('   A note   ');
    });

    it('should assign null to note if note is not provided or is empty', () => {
      const payload = {
        ...validTransactionPayload,
        note: '',
      };
      const [transaction] = transactionEntity.make(payload, [validItemPayload]);
      expect(transaction.note).toBeNull();

      const payloadNull = {
        ...validTransactionPayload,
        note: null as any,
      };
      const [transactionNull] = transactionEntity.make(payloadNull, [
        validItemPayload,
      ]);
      expect(transactionNull.note).toBeNull();
    });

    it('should throw an error if items are provided for transfer transaction', () => {
      const transferPayload = {
        ...validTransactionPayload,
        type: ETransactionType.Transfer,
        recipientAccountId: 'acc-2',
      };

      expect(() =>
        transactionEntity.make(transferPayload, [validItemPayload])
      ).toThrow(AppError);
    });

    it('should throw an error if itemsPayload is missing for non-transfer transaction', () => {
      expect(() => transactionEntity.make(validTransactionPayload, [])).toThrow(
        AppError
      );
    });

    it('should throw an error if transaction type is invalid', () => {
      const payload = {
        ...validTransactionPayload,
        type: 'invalid-type' as any,
      };

      expect(() => transactionEntity.make(payload, [validItemPayload])).toThrow(
        AppError
      );
    });

    it('should throw an error if createdBy is not a string', () => {
      const payload = {
        ...validTransactionPayload,
        createdBy: 123 as any,
      };

      expect(() => transactionEntity.make(payload, [validItemPayload])).toThrow(
        AppError
      );
    });

    it('should throw an error if accountId is not a string', () => {
      const payload = {
        ...validTransactionPayload,
        accountId: 123 as any,
      };

      expect(() => transactionEntity.make(payload, [validItemPayload])).toThrow(
        AppError
      );
    });

    it('should throw an error if exchangeRate is invalid (not a number)', () => {
      const payload = {
        ...validTransactionPayload,
        exchangeRate: '1' as any,
      };

      expect(() => transactionEntity.make(payload, [validItemPayload])).toThrow(
        AppError
      );
    });

    it('should throw an error if exchangeRate is invalid (<= 0)', () => {
      const payload = {
        ...validTransactionPayload,
        exchangeRate: 0,
      };

      expect(() => transactionEntity.make(payload, [validItemPayload])).toThrow(
        AppError
      );
    });

    it('should throw an error if exchangeRate is NaN', () => {
      const payload = {
        ...validTransactionPayload,
        exchangeRate: NaN,
      };

      expect(() => transactionEntity.make(payload, [validItemPayload])).toThrow(
        AppError
      );
    });

    it('should throw an error if recipientAccountId is provided for non-transfer', () => {
      const payload = {
        ...validTransactionPayload,
        type: ETransactionType.Sale,
        recipientAccountId: 'acc-2',
      };

      expect(() => transactionEntity.make(payload, [validItemPayload])).toThrow(
        AppError
      );
    });

    it('should throw an error if recipientAccountId is invalid string for transfer', () => {
      const payload = {
        ...validTransactionPayload,
        type: ETransactionType.Transfer,
        recipientAccountId: '', // empty string
      };

      expect(() => transactionEntity.make(payload, [])).toThrow(AppError);

      const payload2 = {
        ...validTransactionPayload,
        type: ETransactionType.Transfer,
        recipientAccountId: 123 as any,
      };

      expect(() => transactionEntity.make(payload2, [])).toThrow(AppError);
    });

    it('should throw an error if status is invalid', () => {
      const payload = {
        ...validTransactionPayload,
        status: 'invalid-status' as any,
      };

      expect(() => transactionEntity.make(payload, [validItemPayload])).toThrow(
        AppError
      );
    });

    it('should throw an error if status is not in permitted state for creation', () => {
      const payloadArchive = {
        ...validTransactionPayload,
        status: ETransactionStatus.Archived,
      };

      const payloadVoided = {
        ...validTransactionPayload,
        status: ETransactionStatus.Voided,
      };

      expect(() =>
        transactionEntity.make(payloadArchive, [validItemPayload])
      ).toThrow(AppError);
      expect(() =>
        transactionEntity.make(payloadVoided, [validItemPayload])
      ).toThrow(AppError);
    });

    it('should throw an error if amounts of items do not match transaction amount', () => {
      const invalidAmountPayload = {
        ...validTransactionPayload,
        amount: moneyValue.make(200, currency, false), // Items total is 100
      };

      expect(() =>
        transactionEntity.make(invalidAmountPayload, [validItemPayload])
      ).toThrow(AppError);
    });

    it('should throw an error if functional currency amounts of items do not match transaction amount', () => {
      const invalidFAmountPayload = {
        ...validTransactionPayload,
        functionalCurrencyAmount: moneyValue.make(200, currency, false), // Items total is 100
      };

      expect(() =>
        transactionEntity.make(invalidFAmountPayload, [validItemPayload])
      ).toThrow(AppError);
    });

    it('should throw an error if transaction date is in the future', () => {
      const futureDatePayload = {
        ...validTransactionPayload,
        date: new Date(Date.now() + 86400000), // 1 day in the future
      };

      expect(() =>
        transactionEntity.make(futureDatePayload, [validItemPayload])
      ).toThrow(AppError);
    });
  });
});
