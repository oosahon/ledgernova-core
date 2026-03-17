export const EPersonalTransactionType = {
  Inflow: 'inflow',
  Outflow: 'outflow',
  Transfer: 'transfer',
  Journal: 'journal',
} as const;

export type UPersonalTransactionType =
  (typeof EPersonalTransactionType)[keyof typeof EPersonalTransactionType];
