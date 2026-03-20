import assetAccountHelpers from '../asset-account.helpers';
import {
  EAssetAccountType,
  EAssetAccountSubType,
  ECashAccountSubType,
  EInvestmentAccountSubType,
  EReceivableAccountSubType,
  EInventoryAccountSubType,
  EFixedAssetAccountSubType,
} from '../../../types/asset-account.types';
import { AppError } from '../../../../../shared/value-objects/error';

describe('assetAccountHelpers', () => {
  describe('validateLedgerType', () => {
    it('should pass for valid asset account types', () => {
      Object.values(EAssetAccountType).forEach((type) => {
        expect(() =>
          assetAccountHelpers.validateLedgerType(type)
        ).not.toThrow();
      });
    });

    it('should throw AppError for invalid asset account type', () => {
      expect(() =>
        assetAccountHelpers.validateLedgerType('invalid_type')
      ).toThrow(AppError);
    });
  });

  describe('validateLedgerSubType', () => {
    it('should throw if ledger type is invalid', () => {
      expect(() =>
        assetAccountHelpers.validateLedgerSubType('invalid_type', 'any')
      ).toThrow(AppError);
    });

    it('should pass if subType is Other regardless of valid accountType', () => {
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Cash,
          EAssetAccountSubType.Other
        )
      ).not.toThrow();
    });

    it('should validate Cash subtypes', () => {
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Cash,
          ECashAccountSubType.Bank
        )
      ).not.toThrow();
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Cash,
          'invalid_cash'
        )
      ).toThrow(AppError);
    });

    it('should validate Investment subtypes', () => {
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Investment,
          EInvestmentAccountSubType.Bonds
        )
      ).not.toThrow();
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Investment,
          'invalid_invest'
        )
      ).toThrow(AppError);
    });

    it('should validate Receivable subtypes', () => {
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Receivable,
          EReceivableAccountSubType.AccountsReceivable
        )
      ).not.toThrow();
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Receivable,
          'invalid_rec'
        )
      ).toThrow(AppError);
    });

    it('should validate Inventory subtypes', () => {
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Inventory,
          EInventoryAccountSubType.FinishedGoods
        )
      ).not.toThrow();
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Inventory,
          'invalid_inv'
        )
      ).toThrow(AppError);
    });

    it('should validate FixedAsset subtypes', () => {
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.FixedAsset,
          EFixedAssetAccountSubType.Equipment
        )
      ).not.toThrow();
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.FixedAsset,
          'invalid_fixed'
        )
      ).toThrow(AppError);
    });

    it('should validate Other account types against EAssetAccountSubType', () => {
      // Using EAssetAccountType.Other, which hits the else branch
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Other,
          ECashAccountSubType.Bank
        )
      ).not.toThrow();
      expect(() =>
        assetAccountHelpers.validateLedgerSubType(
          EAssetAccountType.Other,
          'invalid_other_sub'
        )
      ).toThrow(AppError);
    });
  });
});
