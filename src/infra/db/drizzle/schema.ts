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
  numeric,
  bigint,
  date,
  text,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const audit = pgSchema('audit');
export const core = pgSchema('core');
export const accountingDomainInCore = core.enum('accounting_domain', [
  'organization',
  'sole_trader',
  'individual',
]);
export const categoryStatusInCore = core.enum('category_status', [
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
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const currencyExchangeRatesInCore = core.table(
  'currency_exchange_rates',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    baseCurrencyCode: char('base_currency_code', { length: 3 }).notNull(),
    targetCurrencyCode: char('target_currency_code', { length: 3 }).notNull(),
    rate: numeric({ precision: 20, scale: 10 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
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
  ]
);

export const ledgerAccountsInCore = core.table(
  'ledger_accounts',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id').notNull(),
    name: varchar({ length: 200 }).notNull(),
    type: ledgerAccountTypeInCore().notNull(),
    subType: varchar('sub_type', { length: 100 }),
    currencyCode: varchar('currency_code', { length: 3 }).notNull(),
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
      columns: [table.userId],
      foreignColumns: [usersInCore.id],
      name: 'ledger_accounts_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.currencyCode],
      foreignColumns: [currenciesInCore.code],
      name: 'ledger_accounts_currency_code_fkey',
    }),
  ]
);

export const transactionsInCore = core.table(
  'transactions',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
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
    transactionType: transactionTypeInCore('transaction_type').notNull(),
    taxKey: varchar('tax_key', { length: 250 }).notNull(),
    status: categoryStatusInCore().default('active').notNull(),
    description: varchar({ length: 200 }).notNull(),
    parentId: uuid('parent_id'),
    userId: uuid('user_id'),
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
    index().using('btree', table.userId.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'categories_parent_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [usersInCore.id],
      name: 'categories_user_id_fkey',
    }).onDelete('cascade'),
    unique('unique_user_tax_name').on(table.name, table.taxKey, table.userId),
  ]
);
