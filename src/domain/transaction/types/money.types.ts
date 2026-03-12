interface ICurrency {
  code: string;
  symbol: string;
  name: string;
  minorUnit: number;
}

export interface IMoney {
  amount: bigint;
  isInMinorUnit: boolean;
  currency: ICurrency;
}
