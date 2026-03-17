import { ITransactionItem } from '../../types/transaction.types';
import eventValue from '../../../../shared/value-objects/event.vo';

export enum ETransactionItemEvents {
  Created = 'domain:transaction_item:created',
}

function makeCreatedEvent(transactionItem: ITransactionItem) {
  return eventValue.make<ITransactionItem>({
    type: ETransactionItemEvents.Created,
    data: transactionItem,
  });
}

const transactionItemEvents = Object.freeze({
  created: makeCreatedEvent,
});

export default transactionItemEvents;
