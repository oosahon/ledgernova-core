import { TEntityId } from '../../../shared/types/uuid';
import { ICurrency } from '../../currency/types/currency.types';

export const EAccountingEntityType = {
  Individual: 'individual',
  SoleTrader: 'sole_trader',
  Company: 'company',
} as const;

export type UAccountingEntityType =
  (typeof EAccountingEntityType)[keyof typeof EAccountingEntityType];

export interface IAccountingEntity {
  id: TEntityId;
  type: UAccountingEntityType;
  ownerId: TEntityId;
  functionalCurrency: ICurrency;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
