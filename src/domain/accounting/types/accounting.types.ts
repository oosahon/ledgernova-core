export const EAccountingDomain = {
  Organization: 'organization',
  SoleTrader: 'sole_trader',
  Individual: 'individual',
} as const;

export type UAccountingDomain =
  (typeof EAccountingDomain)[keyof typeof EAccountingDomain];
