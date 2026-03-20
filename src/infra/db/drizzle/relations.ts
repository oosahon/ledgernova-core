import { relations } from 'drizzle-orm/relations';
import {
  usersInCore,
  userActivitiesInAudit,
  currenciesInCore,
  ledgerAccountsInCore,
  userLedgerAccountsInCore,
  transactionsInCore,
  categoriesInCore,
  transactionItemsInCore,
  currencyExchangeRatesInCore,
} from './schema';

export const userActivitiesInAuditRelations = relations(
  userActivitiesInAudit,
  ({ one }) => ({
    usersInCore: one(usersInCore, {
      fields: [userActivitiesInAudit.userId],
      references: [usersInCore.id],
    }),
  })
);

export const usersInCoreRelations = relations(usersInCore, ({ many }) => ({
  userActivitiesInAudits: many(userActivitiesInAudit),
  ledgerAccountsInCores: many(ledgerAccountsInCore),
  userLedgerAccountsInCores: many(userLedgerAccountsInCore),
  transactionsInCores: many(transactionsInCore),
  categoriesInCores: many(categoriesInCore),
}));

export const ledgerAccountsInCoreRelations = relations(
  ledgerAccountsInCore,
  ({ one, many }) => ({
    currenciesInCore: one(currenciesInCore, {
      fields: [ledgerAccountsInCore.currencyCode],
      references: [currenciesInCore.code],
    }),
    ledgerAccountsInCore: one(ledgerAccountsInCore, {
      fields: [ledgerAccountsInCore.parentId],
      references: [ledgerAccountsInCore.id],
      relationName: 'ledgerAccountsInCore_parentId_ledgerAccountsInCore_id',
    }),
    ledgerAccountsInCores: many(ledgerAccountsInCore, {
      relationName: 'ledgerAccountsInCore_parentId_ledgerAccountsInCore_id',
    }),
    usersInCore: one(usersInCore, {
      fields: [ledgerAccountsInCore.createdBy],
      references: [usersInCore.id],
    }),
    userLedgerAccountsInCores: many(userLedgerAccountsInCore),
    transactionsInCores_ledgerAccountId: many(transactionsInCore, {
      relationName:
        'transactionsInCore_ledgerAccountId_ledgerAccountsInCore_id',
    }),
    transactionsInCores_recipientAccountId: many(transactionsInCore, {
      relationName:
        'transactionsInCore_recipientAccountId_ledgerAccountsInCore_id',
    }),
  })
);

export const currenciesInCoreRelations = relations(
  currenciesInCore,
  ({ many }) => ({
    ledgerAccountsInCores: many(ledgerAccountsInCore),
    transactionsInCores: many(transactionsInCore),
    transactionItemsInCores: many(transactionItemsInCore),
    currencyExchangeRatesInCores_baseCurrencyCode: many(
      currencyExchangeRatesInCore,
      {
        relationName:
          'currencyExchangeRatesInCore_baseCurrencyCode_currenciesInCore_code',
      }
    ),
    currencyExchangeRatesInCores_targetCurrencyCode: many(
      currencyExchangeRatesInCore,
      {
        relationName:
          'currencyExchangeRatesInCore_targetCurrencyCode_currenciesInCore_code',
      }
    ),
  })
);

export const userLedgerAccountsInCoreRelations = relations(
  userLedgerAccountsInCore,
  ({ one }) => ({
    usersInCore: one(usersInCore, {
      fields: [userLedgerAccountsInCore.userId],
      references: [usersInCore.id],
    }),
    ledgerAccountsInCore: one(ledgerAccountsInCore, {
      fields: [userLedgerAccountsInCore.ledgerAccountId],
      references: [ledgerAccountsInCore.id],
    }),
  })
);

export const transactionsInCoreRelations = relations(
  transactionsInCore,
  ({ one, many }) => ({
    usersInCore: one(usersInCore, {
      fields: [transactionsInCore.createdBy],
      references: [usersInCore.id],
    }),
    ledgerAccountsInCore_ledgerAccountId: one(ledgerAccountsInCore, {
      fields: [transactionsInCore.ledgerAccountId],
      references: [ledgerAccountsInCore.id],
      relationName:
        'transactionsInCore_ledgerAccountId_ledgerAccountsInCore_id',
    }),
    currenciesInCore: one(currenciesInCore, {
      fields: [transactionsInCore.currencyCode],
      references: [currenciesInCore.code],
    }),
    ledgerAccountsInCore_recipientAccountId: one(ledgerAccountsInCore, {
      fields: [transactionsInCore.recipientAccountId],
      references: [ledgerAccountsInCore.id],
      relationName:
        'transactionsInCore_recipientAccountId_ledgerAccountsInCore_id',
    }),
    transactionItemsInCores: many(transactionItemsInCore),
  })
);

export const categoriesInCoreRelations = relations(
  categoriesInCore,
  ({ one, many }) => ({
    categoriesInCore: one(categoriesInCore, {
      fields: [categoriesInCore.parentId],
      references: [categoriesInCore.id],
      relationName: 'categoriesInCore_parentId_categoriesInCore_id',
    }),
    categoriesInCores: many(categoriesInCore, {
      relationName: 'categoriesInCore_parentId_categoriesInCore_id',
    }),
    usersInCore: one(usersInCore, {
      fields: [categoriesInCore.createdBy],
      references: [usersInCore.id],
    }),
    transactionItemsInCores: many(transactionItemsInCore),
  })
);

export const transactionItemsInCoreRelations = relations(
  transactionItemsInCore,
  ({ one }) => ({
    transactionsInCore: one(transactionsInCore, {
      fields: [transactionItemsInCore.transactionId],
      references: [transactionsInCore.id],
    }),
    categoriesInCore: one(categoriesInCore, {
      fields: [transactionItemsInCore.categoryId],
      references: [categoriesInCore.id],
    }),
    currenciesInCore: one(currenciesInCore, {
      fields: [transactionItemsInCore.currencyCode],
      references: [currenciesInCore.code],
    }),
  })
);

export const currencyExchangeRatesInCoreRelations = relations(
  currencyExchangeRatesInCore,
  ({ one }) => ({
    currenciesInCore_baseCurrencyCode: one(currenciesInCore, {
      fields: [currencyExchangeRatesInCore.baseCurrencyCode],
      references: [currenciesInCore.code],
      relationName:
        'currencyExchangeRatesInCore_baseCurrencyCode_currenciesInCore_code',
    }),
    currenciesInCore_targetCurrencyCode: one(currenciesInCore, {
      fields: [currencyExchangeRatesInCore.targetCurrencyCode],
      references: [currenciesInCore.code],
      relationName:
        'currencyExchangeRatesInCore_targetCurrencyCode_currenciesInCore_code',
    }),
  })
);
