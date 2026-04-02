import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ILedgerAccount,
} from './ledger.types';

export type TSuspenseSubType = 'suspense';
export type TSuspenseBehavior = 'default';

export interface ISuspenseLedgerAccount extends ILedgerAccount {
  subType: TSuspenseSubType;
  behavior: TSuspenseBehavior;
  isControlAccount: false;
  controlAccountId: null;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}
