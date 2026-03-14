export interface ICurrency {
  code: string;
  symbol: string;
  name: string;
  minorUnit: bigint;
}

export interface IMoney {
  amount: bigint;
  currency: ICurrency;
}
