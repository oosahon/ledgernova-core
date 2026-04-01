import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerType,
  ILedgerAccount,
} from './ledger.types';

export type TSuspenseSubType = 'suspense';
export type TSuspenseBehavior = 'default';

export interface ISuspenseLedgerAccount extends ILedgerAccount {
  type: typeof ELedgerType.Asset | typeof ELedgerType.Liability;
  subType: TSuspenseSubType;
  behavior: TSuspenseBehavior;
  contraAccountRule: typeof EContraAccountRule.ContraNotPermitted;
  adjunctAccountRule: typeof EAdjunctAccountRule.AdjunctNotPermitted;
}
