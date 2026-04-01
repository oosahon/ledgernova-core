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

import { NAIRA } from '../../../../app/bootstrap/data/currencies';
import { AppError } from '../../../../shared/value-objects/error';

import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
  ULedgerType,
} from '../../types/ledger.types';
import { ISuspenseLedgerAccount } from '../../types/suspense-account';
import ledgerAccountEntity from './ledger-account.entity';

function validateType(type: ULedgerType) {
  if (type !== ELedgerType.Asset && type !== ELedgerType.Liability) {
    throw new AppError('Invalid ledger type', { cause: type });
  }
}

/**
 * Creates the default, top-level suspense account for an accounting entity.
 */
function makeDefaultControlAccount(
  payload: Pick<
    ISuspenseLedgerAccount,
    'type' | 'name' | 'createdBy' | 'accountingEntityId'
  >
) {
  validateType(payload.type);

  const codeMap = {
    [ELedgerType.Asset]: '199000',
    [ELedgerType.Liability]: '299000',
  };

  return ledgerAccountEntity.make<ISuspenseLedgerAccount>({
    type: payload.type,
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    createdBy: payload.createdBy,
    code: codeMap[payload.type],
    subType: 'suspense',
    behavior: 'default',
    isControlAccount: true,
    controlAccountId: null,
    currency: { ...NAIRA },
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
  });
}

/**
 * Create a suspense sub-ledger account
 *
 */
function makeSubLedgerAccount() {
  // TODO: Implement
}

const suspenseAccountEntity = Object.freeze({
  makeDefaultControlAccount,
  makeSubLedgerAccount,
});

export default suspenseAccountEntity;
