import { TCreationOmits } from '../../../../shared/types/creation-omits.types';
import { TEntityWithEvents } from '../../../../shared/types/event.types';
import stringUtils from '../../../../shared/utils/string';
import liabilityAccountEvents from '../../events/liability-account.events';
import {
  ELiabilityAccountBehavior,
  ELiabilitySubType,
  ICreditCardAccount,
  ICreditCardAccountMeta,
  IOverdraftAccount,
  IOverdraftAccountMeta,
  IShortTermLoanAccount,
  IShortTermLoanAccountMeta,
} from '../../types/liability-account.types';
import { TShortTermDebtLedgerCode } from '../../types/ledger-code.types';
import {
  EAdjunctAccountRule,
  EContraAccountRule,
  ELedgerAccountStatus,
  ELedgerType,
} from '../../types/ledger.types';
import ledgerAccountEntity from '../shared/ledger-account.entity';

function getCode(
  predecessorCode: TShortTermDebtLedgerCode
): TShortTermDebtLedgerCode {
  return ledgerAccountEntity.getSubLedgerCode<TShortTermDebtLedgerCode>(
    '200',
    predecessorCode
  );
}

function makeCreditCardAccountMeta(meta: ICreditCardAccountMeta) {
  const cardIssuer = stringUtils.sanitizeAndValidate(meta.cardIssuer, {
    min: 2,
    max: 100,
  });

  const lastFourDigits = stringUtils.sanitizeAndValidate(meta.lastFourDigits, {
    min: 4,
    max: 4,
  });

  return Object.freeze<ICreditCardAccountMeta>({
    cardIssuer,
    lastFourDigits,
    lastReconciliationDate: null,
  });
}

function makeCreditCardAccount(
  payload: TCreationOmits<ICreditCardAccount>,
  predecessorCode: TShortTermDebtLedgerCode
): TEntityWithEvents<ICreditCardAccount, ICreditCardAccount> {
  stringUtils.validateUUID(payload.controlAccountId);

  const account = ledgerAccountEntity.make<ICreditCardAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    type: ELedgerType.Liability,
    subType: ELiabilitySubType.ShortTermDebt,
    behavior: ELiabilityAccountBehavior.CreditCard,
    isControlAccount: payload.isControlAccount,
    controlAccountId: payload.controlAccountId,
    currency: payload.currency,
    meta: makeCreditCardAccountMeta(payload.meta),
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctPermitted,
    createdBy: payload.createdBy,
  });

  const event = liabilityAccountEvents.creditCardCreated(account);
  return [account, [event]];
}

function makeOverdraftAccountMeta(meta: IOverdraftAccountMeta) {
  stringUtils.validateUUID(meta.linkedBankAccountId);

  return Object.freeze<IOverdraftAccountMeta>({
    linkedBankAccountId: meta.linkedBankAccountId,
  });
}

function makeOverdraftAccount(
  payload: TCreationOmits<IOverdraftAccount>,
  predecessorCode: TShortTermDebtLedgerCode
): TEntityWithEvents<IOverdraftAccount, IOverdraftAccount> {
  const account = ledgerAccountEntity.make<IOverdraftAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    type: ELedgerType.Liability,
    subType: ELiabilitySubType.ShortTermDebt,
    behavior: ELiabilityAccountBehavior.Overdraft,
    isControlAccount: payload.isControlAccount,
    controlAccountId: payload.controlAccountId,
    currency: payload.currency,
    meta: makeOverdraftAccountMeta(payload.meta),
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctPermitted,
    createdBy: payload.createdBy,
  });

  const event = liabilityAccountEvents.overdraftCreated(account);
  return [account, [event]];
}

function makeShortTermLoanAccountMeta(meta: IShortTermLoanAccountMeta) {
  const lenderName = stringUtils.sanitizeAndValidate(meta.lenderName, {
    min: 2,
    max: 100,
  });

  return Object.freeze<IShortTermLoanAccountMeta>({
    lenderName,
    maturityDate: meta.maturityDate,
  });
}

function makeShortTermLoanAccount(
  payload: TCreationOmits<IShortTermLoanAccount>,
  predecessorCode: TShortTermDebtLedgerCode
): TEntityWithEvents<IShortTermLoanAccount, IShortTermLoanAccount> {
  const account = ledgerAccountEntity.make<IShortTermLoanAccount>({
    name: payload.name,
    accountingEntityId: payload.accountingEntityId,
    code: getCode(predecessorCode),
    type: ELedgerType.Liability,
    subType: ELiabilitySubType.ShortTermDebt,
    behavior: ELiabilityAccountBehavior.ShortTermLoan,
    isControlAccount: payload.isControlAccount,
    controlAccountId: payload.controlAccountId,
    currency: payload.currency,
    meta: makeShortTermLoanAccountMeta(payload.meta),
    status: ELedgerAccountStatus.Active,
    contraAccountRule: EContraAccountRule.ContraPermitted,
    adjunctAccountRule: EAdjunctAccountRule.AdjunctPermitted,
    createdBy: payload.createdBy,
  });

  const event = liabilityAccountEvents.shortTermLoanCreated(account);
  return [account, [event]];
}

const shortTermLoanLiabilityLedgerEntity = Object.freeze({
  makeCreditCardAccountMeta,
  makeCreditCardAccount,

  makeOverdraftAccountMeta,
  makeOverdraftAccount,

  makeShortTermLoanAccountMeta,
  makeShortTermLoanAccount,

  getCode,
});

export default shortTermLoanLiabilityLedgerEntity;
