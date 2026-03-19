import { TCreationOmits } from '../../../shared/types/creation-omits.types';
import { TEntityWithEvents } from '../../../shared/types/event.types';
import stringUtils from '../../../shared/utils/string';
import generateUUID from '../../../shared/utils/uuid-generator';
import accountingHelpers from '../../accounting/helpers/accounting.helpers';
import currencyEntity from '../../currency/entities/currency.entity';
import generalLedgerAccountEvents from '../events/gl-account.events';
import ledgerAccountEvents from '../events/ledger-account.events';
import {
  ELedgerAccountStatus,
  IGeneralLedgerAccount,
  ILedgerAccount,
} from '../types/index.types';
import helpers from './helpers/ledger-account.helpers';

/**
 * Creates a general ledger account.
 * @param payload - The account payload.
 * @returns A tuple containing the account and the created event.
 */
function makeGeneralLedger(
  payload: TCreationOmits<IGeneralLedgerAccount>
): TEntityWithEvents<IGeneralLedgerAccount, IGeneralLedgerAccount> {
  currencyEntity.validateCode(payload.currencyCode);
  helpers.validateLedgerAccountType(
    payload.ledgerType,
    payload.ledgerAccountType
  );
  accountingHelpers.validateLedgerCode(payload.ledgerType, payload.ledgerCode);

  const timestamp = new Date();

  const generalLedger: IGeneralLedgerAccount = Object.freeze({
    id: generateUUID(),
    name: stringUtils.sanitizeAndValidate(payload.name, { max: 100, min: 1 }),
    // TODO: use accounting rule to generate ledger code
    ledgerCode: payload.ledgerCode,
    ledgerType: payload.ledgerType,
    ledgerAccountType: payload.ledgerAccountType,
    currencyCode: payload.currencyCode,
    status: ELedgerAccountStatus.Active,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  });

  const event = generalLedgerAccountEvents.created(generalLedger);
  return [generalLedger, [event]];
}

/**
 * Creates a ledger account.
 * @param payload - The account payload.
 * @returns A tuple containing the account and the created event.
 */
function makeLedgerAccount(
  parentLedger: IGeneralLedgerAccount | ILedgerAccount,
  payload: Pick<
    ILedgerAccount,
    'name' | 'subType' | 'currencyCode' | 'ledgerCode'
  >
): TEntityWithEvents<ILedgerAccount, ILedgerAccount> {
  stringUtils.validateUUID(parentLedger.id);
  accountingHelpers.validateLedgerCode(
    parentLedger.ledgerType,
    parentLedger.ledgerCode
  );

  const isLedgerAccountParent = 'parentId' in parentLedger;

  const currencyCode = isLedgerAccountParent
    ? parentLedger.currencyCode
    : payload.currencyCode;

  currencyEntity.validateCode(currencyCode);

  const subType = isLedgerAccountParent
    ? parentLedger.subType
    : payload.subType;

  helpers.validateLedgerAccountSubType(
    parentLedger.ledgerType,
    parentLedger.ledgerAccountType,
    subType
  );

  const timestamp = new Date();

  const account: ILedgerAccount = Object.freeze({
    id: generateUUID(),
    name: stringUtils.sanitizeAndValidate(payload.name, { max: 100, min: 1 }),
    // TODO: use accounting rule to generate ledger code
    ledgerCode: payload.ledgerCode,
    ledgerType: parentLedger.ledgerType,
    ledgerAccountType: parentLedger.ledgerAccountType,
    subType,
    parentId: parentLedger.id,
    currencyCode,
    status: ELedgerAccountStatus.Active,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  });

  const event = ledgerAccountEvents.created(account);
  return [account, [event]];
}

const ledgerAccountEntity = Object.freeze({
  makeGeneralLedger,
  makeLedgerAccount,
  ...helpers,
});

export default ledgerAccountEntity;
