import { ITransaction } from '../../types/transaction.types';
import eventValue from '../../../../shared/value-objects/event.vo';

export enum ETransactionEvents {
  Created = 'domain:transaction:created',
}

function makeCreatedEvent(transaction: ITransaction) {
  return eventValue.make<ITransaction>({
    type: ETransactionEvents.Created,
    data: transaction,
  });
}

const transactionEvents = Object.freeze({
  created: makeCreatedEvent,
});

export default transactionEvents;
