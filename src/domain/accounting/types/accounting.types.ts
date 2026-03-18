export const EAccountingDomain = {
  Corporate: 'corporate',
  SoleTrader: 'sole_trader',
  Personal: 'personal',
} as const;

export type UAccountingDomain =
  (typeof EAccountingDomain)[keyof typeof EAccountingDomain];
