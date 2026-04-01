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

import deepFreeze from '../../../../shared/utils/deep-freeze';
import stringUtils from '../../../../shared/utils/string';
import generateUUID from '../../../../shared/utils/uuid-generator';
import { AppError } from '../../../../shared/value-objects/error';
import accountingEntity from '../../../accounting/entities/accounting-entity.entity';
import userEntity from '../../../user/entities/user.entity';
import { ELedgerType } from '../../types/index.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ISuspenseLedgerAccount,
  ULedgerType,
} from '../../types/ledger.types';

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
    'type' | 'name' | 'createdBy' | 'accountingEntity'
  >
) {
  const timestamp = new Date();

  accountingEntity.validate(payload.accountingEntity);
  userEntity.validate(payload.createdBy);
  validateType(payload.type);

  const code = payload.type === ELedgerType.Asset ? '100001' : '200001';

  const account: ISuspenseLedgerAccount = {
    id: generateUUID(),
    code,
    accountingEntity: payload.accountingEntity,
    name: stringUtils.sanitizeAndValidate(payload.name, { min: 2, max: 100 }),
    isControlAccount: true,
    controlAccount: null,
    currency: payload.accountingEntity.functionalCurrency,
    status: ELedgerAccountStatus.Active,
    subType: 'suspense',
    behavior: 'default',
    contraAccountRule: EContraAccountRule.ContraNotPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctNotPermitted,
    type: payload.type,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    createdBy: payload.createdBy,
  };

  return deepFreeze(account);
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
