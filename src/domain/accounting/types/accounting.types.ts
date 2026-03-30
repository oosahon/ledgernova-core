import { ICurrency } from '../../currency/types/currency.types';
import { IUser } from '../../user/types/user.types';

export const EAccountingEntityType = {
  Individual: 'individual',
  SoleTrader: 'sole_trader',
  Company: 'company',
} as const;

export type UAccountingEntityType =
  (typeof EAccountingEntityType)[keyof typeof EAccountingEntityType];

export interface IaccountingEntityTypeEntity {
  id: string;
  type: UAccountingEntityType;
  owner: IUser;
  functionalCurrency: ICurrency;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
