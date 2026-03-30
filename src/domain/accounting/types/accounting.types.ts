import { ICurrency } from '../../currency/types/currency.types';
import { IUser } from '../../user/types/user.types';

export const EAccountingDomain = {
  Organization: 'organization',
  SoleTrader: 'sole_trader',
  Individual: 'individual',
} as const;

export type UAccountingDomain =
  (typeof EAccountingDomain)[keyof typeof EAccountingDomain];

export interface IIndividualDomain {
  id: string;
  owner: IUser;
  functionalCurrency: ICurrency;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
