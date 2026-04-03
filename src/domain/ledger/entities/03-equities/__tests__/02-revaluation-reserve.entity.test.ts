import { AppError } from '../../../../../shared/value-objects/error';
import generateUUID from '../../../../../shared/utils/uuid-generator';
import revaluationReserveLedgerEntity from '../02-revaluation-reserve.entity';
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

describe('Revaluation Reserve Entity', () => {
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
    it('should generate the next sub-ledger code for revaluation reserve accounts', () => {
      expect(revaluationReserveLedgerEntity.getCode('302000')).toBe('302001');
      expect(revaluationReserveLedgerEntity.getCode('302099')).toBe('302100');
    });

    it('should throw if predecessor code does not match header code', () => {
      expect(() =>
        revaluationReserveLedgerEntity.getCode('300000' as any)
      ).toThrow(AppError);
    });
  });

  describe('make', () => {
    const validPayload = {
      name: 'Property Revaluation Reserve',
      accountingEntityId: validUUID1,
      currency: validCurrency,
      createdBy: validUUID2,
    };

    it('should successfully create a revaluation reserve account', () => {
      const [account, events] = revaluationReserveLedgerEntity.make(
        validPayload,
        '302000'
      );

      expect(account.code).toBe('302001');
      expect(account.type).toBe(ELedgerType.Equity);
      expect(account.subType).toBe(EEquitySubType.Reserve);
      expect(account.behavior).toBe(EEquityAccountBehavior.RevaluationReserve);
      expect(account.meta).toBeNull();
      expect(account.isControlAccount).toBe(false);
      expect(account.controlAccountId).toBeNull();
      expect(account.status).toBe(ELedgerAccountStatus.Active);
      expect(account.contraAccountRule).toBe(
        EContraAccountRule.ContraNotPermitted
      );
      expect(account.adjunctAccountRule).toBe(
        EAdjunctAccountRule.AdjunctNotPermitted
      );

      expect(account.name).toBe('Property Revaluation Reserve');
      expect(account.accountingEntityId).toBe(validUUID1);
      expect(account.createdBy).toBe(validUUID2);
      expect(account.currency).toEqual(validCurrency);
      expect(events).toHaveLength(1);
    });

    it('should throw if payload values are invalid', () => {
      const invalidPayload = { ...validPayload, name: 'A' };
      expect(() =>
        revaluationReserveLedgerEntity.make(invalidPayload, '302000')
      ).toThrow(AppError);
    });
  });
});
