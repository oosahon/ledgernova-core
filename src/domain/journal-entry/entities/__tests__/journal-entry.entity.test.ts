import journalEntriesEntity from '../journal-entry.entity';
import { EJournalDirection } from '../../types/journal-entry.types';
import { ELedgerType } from '../../../ledger/types/index.types';
import moneyValue from '../../../../shared/value-objects/money.vo';
import { AppError } from '../../../../shared/value-objects/error';

describe('Journal Entry Entity', () => {
  const currency = {
    code: 'USD',
    minorUnit: 2n,
    symbol: '$',
    name: 'US Dollar',
  };

  const transactionId = '550e8400-e29b-41d4-a716-446655440000';
  const accountId = '850e8400-e29b-41d4-a716-446655440000';
  const amount = moneyValue.make(100, currency, false);
  const functionalAmount = moneyValue.make(100, currency, false);

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('make', () => {
    it('should create a valid journal entry with description and postedAt', () => {
      const payload = {
        ledgerAccountType: ELedgerType.Asset,
        accountId,
        transactionId,
        amount,
        functionalAmount,
        description: 'Test description',
        postedAt: new Date('2024-01-02T00:00:00Z'),
      };

      const [journalEntry, [event]] = journalEntriesEntity.make(
        EJournalDirection.Debit,
        payload
      );

      expect(journalEntry.id).toBeDefined();
      expect(journalEntry.direction).toBe(EJournalDirection.Debit);
      expect(journalEntry.ledgerAccountType).toBe(ELedgerType.Asset);
      expect(journalEntry.accountId).toBe(accountId);
      expect(journalEntry.transactionId).toBe(transactionId);
      expect(journalEntry.amount).toEqual(amount);
      expect(journalEntry.functionalAmount).toEqual(functionalAmount);
      expect(journalEntry.description).toBe('Test description');
      expect(journalEntry.postedAt).toEqual(payload.postedAt);
      expect(journalEntry.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
      expect(journalEntry.updatedAt).toEqual(new Date('2024-01-01T00:00:00Z'));

      expect(event.event.type).toBe('domain:journal-entry:created');
      expect(event.event.data).toEqual(journalEntry);
    });

    it('should create a valid journal entry with empty description and without postedAt', () => {
      const payload = {
        ledgerAccountType: ELedgerType.Liability,
        accountId,
        transactionId,
        amount,
        functionalAmount,
        description: '',
        postedAt: null,
      };

      const [journalEntry, [event]] = journalEntriesEntity.make(
        EJournalDirection.Credit,
        payload
      );

      expect(journalEntry.description).toBe('');
      expect(journalEntry.postedAt).toBeNull();
      expect(event.event.type).toBe('domain:journal-entry:created');
      expect(event.event.data).toEqual(journalEntry);
    });

    it('should throw an error for invalid direction', () => {
      const payload = {
        ledgerAccountType: ELedgerType.Asset,
        accountId,
        transactionId,
        amount,
        functionalAmount,
        description: 'Test',
        postedAt: null,
      };

      expect(() =>
        journalEntriesEntity.make('INVALID' as any, payload)
      ).toThrow(AppError);
    });

    it('should throw an error if description is too long', () => {
      const payload = {
        ledgerAccountType: ELedgerType.Asset,
        accountId,
        transactionId,
        amount,
        functionalAmount,
        description: 'a'.repeat(256),
        postedAt: null,
      };

      expect(() =>
        journalEntriesEntity.make(EJournalDirection.Debit, payload)
      ).toThrow(AppError);
    });
  });

  describe('validateDirection', () => {
    it('should not throw for valid directions', () => {
      expect(() =>
        journalEntriesEntity.validateDirection(EJournalDirection.Debit)
      ).not.toThrow();
      expect(() =>
        journalEntriesEntity.validateDirection(EJournalDirection.Credit)
      ).not.toThrow();
    });

    it('should throw for an invalid direction', () => {
      expect(() =>
        journalEntriesEntity.validateDirection('UNKNOWN' as any)
      ).toThrow(AppError);
    });
  });

  describe('validatePostedAt', () => {
    it('should not throw if postedAt is null', () => {
      expect(() => journalEntriesEntity.validatePostedAt(null)).not.toThrow();
    });

    it('should not throw if postedAt is in the future relative to current time', () => {
      // The current time is mocked to 2024-01-01T00:00:00Z
      expect(() =>
        journalEntriesEntity.validatePostedAt(new Date('2024-01-02T00:00:00Z'))
      ).not.toThrow();
    });

    it('should throw if postedAt is in the past relative to current time', () => {
      expect(() =>
        journalEntriesEntity.validatePostedAt(new Date('2023-12-31T00:00:00Z'))
      ).toThrow(AppError);
    });
  });
});
