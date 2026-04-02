import { TEntityId } from '../../../shared/types/uuid';
import { TAssetLedgerCode } from './ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ILedgerAccount,
} from './ledger.types';

export type TSuspenseSubType = 'suspense';
export type TSuspenseBehavior = 'default';

interface ITargetAccount {
  id: TEntityId;
  code: TAssetLedgerCode; // TODO add liability code
}

export interface ISuspenseAccountMeta {
  targetAccount: ITargetAccount;
}

export interface ISuspenseLedgerAccount extends ILedgerAccount {
  subType: TSuspenseSubType;
  behavior: TSuspenseBehavior;
  isControlAccount: false;
  controlAccountId: null;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
  meta: ISuspenseAccountMeta;
}
