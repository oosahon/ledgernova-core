import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgSchema,
  unique,
  uuid,
  boolean,
  index,
  foreignKey,
  jsonb,
  char,
  smallint,
  bigint,
  date,
  numeric,
  text,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const audit = pgSchema('audit');
export const core = pgSchema('core');
export const accountingDomainInCore = core.enum('accounting_domain', [
  'individual',
  'sole_trader',
  'organization',
]);
export const categoryStatusInCore = core.enum('category_status', [
  'active',
  'archived',
]);
export const categoryTypeInCore = core.enum('category_type', [
  'sale',
  'purchase',
  'credit_note',
  'debit_note',
  'expense',
  'payment',
  'receipt',
]);
export const ledgerAccountStatusInCore = core.enum('ledger_account_status', [
  'active',
  'archived',
]);
export const ledgerAccountTypeInCore = core.enum('ledger_account_type', [
  'asset',
  'liability',
  'equity',
  'revenue',
  'expense',
]);
export const transactionStatusInCore = core.enum('transaction_status', [
  'pending',
  'posted',
  'voided',
  'archived',
]);
export const transactionTypeInCore = core.enum('transaction_type', [
  'sale',
  'purchase',
  'credit_note',
  'debit_note',
  'expense',
  'transfer',
  'payment',
  'receipt',
  'journal',
]);

export const pgmigrations = pgTable('pgmigrations', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  runOn: timestamp('run_on', { mode: 'string' }).notNull(),
});

export const seeds = pgTable('seeds', {
  id: serial().primaryKey().notNull(),
  fileName: varchar('file_name', { length: 250 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const usersInCore = core.table(
  'users',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    firstName: varchar('first_name', { length: 200 }).notNull(),
    lastName: varchar('last_name', { length: 200 }).notNull(),
    email: varchar({ length: 200 }).notNull(),
    emailVerified: boolean('email_verified').notNull(),
    password: varchar({ length: 200 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [unique('users_email_key').on(table.email)]
);

export const userActivitiesInAudit = audit.table(
  'user_activities',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id'),
    action: varchar({ length: 50 }).notNull(),
    resourceType: varchar('resource_type', { length: 50 }).notNull(),
    resourceId: uuid('resource_id').notNull(),
    metadata: jsonb(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index().using(
      'btree',
      table.resourceType.asc().nullsLast().op('text_ops'),
      table.resourceId.asc().nullsLast().op('text_ops')
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [usersInCore.id],
      name: 'user_activities_user_id_fkey',
    }).onDelete('cascade'),
  ]
);

export const currenciesInCore = core.table('currencies', {
  code: char({ length: 3 }).primaryKey().notNull(),
  symbol: varchar({ length: 5 }).notNull(),
  name: varchar({ length: 50 }).notNull(),
  minorUnit: smallint('minor_unit').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});

export const ledgerAccountsInCore = core.table(
  'ledger_accounts',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    ledgerCode: varchar('ledger_code', { length: 50 }).notNull(),
    ledgerType: ledgerAccountTypeInCore('ledger_type').notNull(),
    ledgerAccountType: varchar('ledger_account_type', {
      length: 100,
    }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    currencyCode: varchar('currency_code', { length: 3 }).notNull(),
    status: ledgerAccountStatusInCore().default('active').notNull(),
    parentId: uuid('parent_id'),
    subType: varchar('sub_type', { length: 100 }),
    createdBy: uuid('created_by'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index().using('btree', table.parentId.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.currencyCode],
      foreignColumns: [currenciesInCore.code],
      name: 'ledger_accounts_currency_code_fkey',
    }),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'ledger_accounts_parent_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [usersInCore.id],
      name: 'ledger_accounts_created_by_fkey',
    }).onDelete('set null'),
  ]
);

export const userLedgerAccountsInCore = core.table(
  'user_ledger_accounts',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id').notNull(),
    ledgerAccountId: uuid('ledger_account_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index().using(
      'btree',
      table.ledgerAccountId.asc().nullsLast().op('uuid_ops')
    ),
    index().using('btree', table.userId.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [usersInCore.id],
      name: 'user_ledger_accounts_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.ledgerAccountId],
      foreignColumns: [ledgerAccountsInCore.id],
      name: 'user_ledger_accounts_ledger_account_id_fkey',
    }).onDelete('cascade'),
    unique('unique_user_ledger_account').on(
      table.userId,
      table.ledgerAccountId
    ),
  ]
);

export const transactionsInCore = core.table(
  'transactions',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    reference: varchar({ length: 100 }).notNull(),
    type: transactionTypeInCore().notNull(),
    status: transactionStatusInCore().notNull(),
    createdBy: uuid('created_by'),
    ledgerAccountId: uuid('ledger_account_id'),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    amount: bigint({ mode: 'number' }).notNull(),
    currencyCode: varchar('currency_code', { length: 3 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    functionalCurrencyAmount: bigint('functional_currency_amount', {
      mode: 'number',
    }).notNull(),
    date: date().notNull(),
    recipientAccountId: uuid('recipient_account_id'),
    exchangeRate: numeric('exchange_rate', {
      precision: 20,
      scale: 10,
    }).notNull(),
    attachmentIds: uuid('attachment_ids').array().default(['']).notNull(),
    notes: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [usersInCore.id],
      name: 'transactions_created_by_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.ledgerAccountId],
      foreignColumns: [ledgerAccountsInCore.id],
      name: 'transactions_ledger_account_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.currencyCode],
      foreignColumns: [currenciesInCore.code],
      name: 'transactions_currency_code_fkey',
    }),
    foreignKey({
      columns: [table.recipientAccountId],
      foreignColumns: [ledgerAccountsInCore.id],
      name: 'transactions_recipient_account_id_fkey',
    }).onDelete('cascade'),
    unique('transactions_reference_key').on(table.reference),
  ]
);

export const categoriesInCore = core.table(
  'categories',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: varchar({ length: 100 }).notNull(),
    accountingDomain: accountingDomainInCore('accounting_domain').notNull(),
    type: categoryTypeInCore().notNull(),
    taxKey: varchar('tax_key', { length: 250 }).notNull(),
    status: categoryStatusInCore().default('active').notNull(),
    description: varchar({ length: 200 }).notNull(),
    parentId: uuid('parent_id'),
    createdBy: uuid('created_by'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index().using('btree', table.createdBy.asc().nullsLast().op('uuid_ops')),
    index().using('btree', table.parentId.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'categories_parent_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [usersInCore.id],
      name: 'categories_created_by_fkey',
    }).onDelete('set null'),
    unique('unique_creator_tax_name').on(
      table.name,
      table.taxKey,
      table.createdBy
    ),
  ]
);

export const transactionItemsInCore = core.table(
  'transaction_items',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: varchar({ length: 200 }).notNull(),
    transactionId: uuid('transaction_id').notNull(),
    categoryId: uuid('category_id').notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    amount: bigint({ mode: 'number' }).notNull(),
    currencyCode: varchar('currency_code', { length: 3 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    functionalCurrencyAmount: bigint('functional_currency_amount', {
      mode: 'number',
    }).notNull(),
    quantity: numeric({ precision: 20, scale: 10 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    unitPrice: bigint('unit_price', { mode: 'number' }),
    isSystemGenerated: boolean('is_system_generated').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index().using('btree', table.categoryId.asc().nullsLast().op('uuid_ops')),
    index().using(
      'btree',
      table.transactionId.asc().nullsLast().op('uuid_ops')
    ),
    foreignKey({
      columns: [table.transactionId],
      foreignColumns: [transactionsInCore.id],
      name: 'transaction_items_transaction_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categoriesInCore.id],
      name: 'transaction_items_category_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.currencyCode],
      foreignColumns: [currenciesInCore.code],
      name: 'transaction_items_currency_code_fkey',
    }),
  ]
);

export const currencyExchangeRatesInCore = core.table(
  'currency_exchange_rates',
  {
    baseCurrencyCode: char('base_currency_code', { length: 3 }).notNull(),
    targetCurrencyCode: char('target_currency_code', { length: 3 }).notNull(),
    rate: numeric({ precision: 20, scale: 10 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [
    foreignKey({
      columns: [table.baseCurrencyCode],
      foreignColumns: [currenciesInCore.code],
      name: 'currency_exchange_rates_base_currency_code_fkey',
    }),
    foreignKey({
      columns: [table.targetCurrencyCode],
      foreignColumns: [currenciesInCore.code],
      name: 'currency_exchange_rates_target_currency_code_fkey',
    }),
    primaryKey({
      columns: [table.baseCurrencyCode, table.targetCurrencyCode],
      name: 'currency_exchange_rates_pkey',
    }),
  ]
);
