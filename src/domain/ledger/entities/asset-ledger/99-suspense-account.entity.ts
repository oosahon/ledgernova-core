/**
 * A suspense account is a temporary account used to hold funds that are
 * awaiting proper allocation. It is used to ensure that the accounting
 * equation remains balanced even when the proper accounts are not yet known.
 *
 * In the context of an asset ledger, for example, a suspense account is used to hold
 * funds that are awaiting proper allocation. It is used to ensure that the
 * accounting equation remains balanced even when the proper accounts are not
 * yet known.
 *
 * For non-power users, a suspense sub-ledger will predominantly be used for
 * bank reconciliation where one will be created by default for each bank account
 *
 * @see {@link ../__docs__/asset-ledger#suspense-accounts} to understand their behaviors
 *
 */

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
import ledgerAccountEntity from '../shared/ledger-account.entity';

function make(
  payload: Pick<
    IAssetSuspenseAccount,
    'type' | 'name' | 'createdBy' | 'accountingEntityId' | 'currency'
  >,
  predecessorCode: TAssetSuspenseLedgerCode
) {
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
    meta: null, // TODO: revisit this meta behavior during bank reconciliation
    isControlAccount: false,
    controlAccountId: null,
    currency: payload.currency,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
    createdBy: payload.createdBy,
  });
}
