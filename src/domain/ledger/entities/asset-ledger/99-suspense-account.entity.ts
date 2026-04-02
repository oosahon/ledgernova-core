/**
 * For non-power users, a suspense sub-ledger will predominantly be used for
 * bank reconciliation where one will be created by default for each bank account
 *
 * @see {@link ../__docs__/suspense-account.md} to understand their behaviors
 *
 */

import stringUtils from '../../../../shared/utils/string';
import { AppError } from '../../../../shared/value-objects/error';
import {
  EAssetAccountBehavior,
  IAssetSuspenseAccount,
} from '../../types/asset-ledger.types';
import { TAssetSuspenseLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import { ISuspenseAccountMeta } from '../../types/suspense-account.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function validateMeta(meta: ISuspenseAccountMeta) {
  stringUtils.validateUUID(meta.targetAccount.id);
  ledgerAccountEntity.validateCode(meta.targetAccount.code);

  const isAssetOrLiability =
    meta.targetAccount.code.startsWith('1') ||
    meta.targetAccount.code.startsWith('2');

  if (isAssetOrLiability) {
    throw new AppError('Target account must be an asset or liability', {
      cause: meta.targetAccount,
    });
  }
}

function make(
  payload: Pick<
    IAssetSuspenseAccount,
    'type' | 'name' | 'createdBy' | 'accountingEntityId' | 'currency' | 'meta'
  >,
  predecessorCode: TAssetSuspenseLedgerCode
) {
  validateMeta(payload.meta);

  return ledgerAccountEntity.make<IAssetSuspenseAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: ledgerAccountEntity.getSubLedgerCode<TAssetSuspenseLedgerCode>(
      '199',
      predecessorCode
    ),
    type: ELedgerType.Asset,
    subType: 'suspense',
    behavior: EAssetAccountBehavior.Default,
    meta: payload.meta,
    isControlAccount: false,
    controlAccountId: null,
    currency: payload.currency,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
    createdBy: payload.createdBy,
  });
}
