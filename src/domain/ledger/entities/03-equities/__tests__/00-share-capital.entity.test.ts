import { AppError } from '../../../../../shared/value-objects/error';
import generateUUID from '../../../../../shared/utils/uuid-generator';
import shareCapitalLedgerEntity from '../00-share-capital.entity';
import {
  EEquityAccountBehavior,
  EEquitySubType,
} from '../../../types/equity-account.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../../types/ledger.types';

describe('Share/Owner Capital Entity', () => {
  const validUUID1 = generateUUID();
  const validUUID2 = generateUUID();

  const validCurrency = {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    minorUnit: 2n,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('getCode', () => {
    it('should generate the next sub-ledger code for capital accounts', () => {
      expect(shareCapitalLedgerEntity.getCode('300000')).toBe('300001');
      expect(shareCapitalLedgerEntity.getCode('300099')).toBe('300100');
    });

    it('should throw if predecessor code does not match header code', () => {
      expect(() => shareCapitalLedgerEntity.getCode('400000' as any)).toThrow(
        AppError
      );
    });
  });

  describe('make', () => {
    const validPayload = {
      name: 'Owner Initial Contribution',
      accountingEntityId: validUUID1,
      isControlAccount: false,
      controlAccountId: null,
      currency: validCurrency,
      createdBy: validUUID2,
    };

    it('should successfully create a capital account', () => {
      const [account, events] = shareCapitalLedgerEntity.make(
        validPayload,
        '300000'
      );

      expect(account.code).toBe('300001');
      expect(account.type).toBe(ELedgerType.Equity);
      expect(account.subType).toBe(EEquitySubType.Default);
      expect(account.behavior).toBe(EEquityAccountBehavior.OwnerCapital);
      expect(account.meta).toBeNull();
      expect(account.isControlAccount).toBe(false);
      expect(account.controlAccountId).toBeNull();
      expect(account.status).toBe(ELedgerAccountStatus.Active);
      expect(account.contraAccountRule).toBe(
        EContraAccountRule.ContraPermitted
      );
      expect(account.adjunctAccountRule).toBe(
        EAdjunctAccountRule.AdjunctPermitted
      );

      expect(account.name).toBe('Owner Initial Contribution');
      expect(account.accountingEntityId).toBe(validUUID1);
      expect(account.createdBy).toBe(validUUID2);
      expect(account.currency).toEqual(validCurrency);
      expect(events).toHaveLength(1);
    });

    it('should throw if payload values are invalid', () => {
      const invalidPayload = { ...validPayload, name: 'A' }; // Too short
      expect(() =>
        shareCapitalLedgerEntity.make(invalidPayload, '300000')
      ).toThrow(AppError);
    });
  });
});
