import {
  ELedgerAccountStatus,
  ELedgerType,
  IGeneralLedgerAccount,
  ILedgerAccount,
} from '../../types/index.types';
import {
  EAssetAccountSubType,
  EAssetAccountType,
} from '../../types/asset-account.types';
import { ELiabilityAccountType } from '../../types/liability-account.types';
import ledgerAccountEntity from '../ledger-account.entity';
import stringUtils from '../../../../shared/utils/string';

describe('ledger.entity', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-03-14T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('makeGeneralLedger', () => {
    it('should create a general ledger account with createdBy when provided', () => {
      const payload = {
        name: 'Test GL',
        ledgerCode: '11000',
        ledgerType: ELedgerType.Asset,
        ledgerAccountType: EAssetAccountType.Cash,
        currencyCode: 'USD',
        createdBy: 'user-1',
      };

      const [entity, events] = ledgerAccountEntity.makeGeneralLedger(
        payload as any
      );

      // Verify the properties match
      expect(typeof entity.id).toBe('string');
      expect(stringUtils.validateUUID(entity.id)).toBeUndefined(); // validateUUID throws if invalid
      expect(entity.name).toBe('Test GL');
      expect(entity.ledgerCode).toBe('11000');
      expect(entity.ledgerType).toBe(ELedgerType.Asset);
      expect(entity.ledgerAccountType).toBe(EAssetAccountType.Cash);
      expect(entity.currencyCode).toBe('USD');
      expect(entity.status).toBe(ELedgerAccountStatus.Active);
      expect(entity.createdBy).toBe('user-1');
      expect(entity.createdAt).toEqual(new Date('2026-03-14T10:00:00.000Z'));
      expect(entity.updatedAt).toEqual(new Date('2026-03-14T10:00:00.000Z'));
      expect(entity.deletedAt).toBeNull();

      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:ledger:general:created');
      expect(events[0].event.data).toEqual(entity);
    });

    it('should create a general ledger account with null createdBy when not provided', () => {
      const payload = {
        name: 'Test GL No User',
        ledgerCode: '21000',
        ledgerType: ELedgerType.Liability,
        ledgerAccountType: ELiabilityAccountType.Payable,
        currencyCode: 'EUR',
      };

      const [entity] = ledgerAccountEntity.makeGeneralLedger(payload as any);

      expect(entity.createdBy).toBeNull();
    });
  });

  describe('makeLedgerAccount', () => {
    it('should create a ledger account when parent is an IGeneralLedgerAccount', () => {
      const parentLedger = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ledgerType: ELedgerType.Asset,
        ledgerAccountType: EAssetAccountType.Cash,
        ledgerCode: '11000',
      } as IGeneralLedgerAccount;

      const payload = {
        name: 'Test Child',
        subType: EAssetAccountSubType.Cash,
        currencyCode: 'GBP',
        ledgerCode: '11100',
        createdBy: 'user-2',
      };

      const [entity, events] = ledgerAccountEntity.makeLedgerAccount(
        parentLedger,
        payload
      );

      expect(typeof entity.id).toBe('string');
      expect(entity.name).toBe('Test Child');
      expect(entity.ledgerCode).toBe('11100');
      expect(entity.ledgerType).toBe(ELedgerType.Asset);
      expect(entity.ledgerAccountType).toBe(EAssetAccountType.Cash);
      expect(entity.subType).toBe(EAssetAccountSubType.Cash);
      expect(entity.parentId).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(entity.currencyCode).toBe('GBP');
      expect(entity.status).toBe(ELedgerAccountStatus.Active);
      expect(entity.createdBy).toBe('user-2');
      expect(entity.createdAt).toEqual(new Date('2026-03-14T10:00:00.000Z'));

      expect(events).toHaveLength(1);
      expect(events[0].event.type).toBe('domain:ledger:account:created');
      expect(events[0].event.data).toEqual(entity);
    });

    it('should create a ledger account when parent is an ILedgerAccount, inheriting currencyCode and subType, with no createdBy', () => {
      const parentLedger = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        parentId: '123e4567-e89b-12d3-a456-426614174000',
        ledgerType: ELedgerType.Asset,
        ledgerAccountType: EAssetAccountType.Cash,
        ledgerCode: '11100',
        currencyCode: 'CAD',
        subType: EAssetAccountSubType.Cash,
      } as ILedgerAccount;

      const payload = {
        name: 'Test Grandchild',
        subType: 'invalid_sub_type', // Should be ignored
        currencyCode: 'invalid_currency', // Should be ignored
        ledgerCode: '11110',
      };

      const [entity] = ledgerAccountEntity.makeLedgerAccount(
        parentLedger,
        payload as any
      );

      expect(entity.currencyCode).toBe('CAD');
      expect(entity.subType).toBe(EAssetAccountSubType.Cash);
      expect(entity.createdBy).toBeNull();
    });
  });
});
