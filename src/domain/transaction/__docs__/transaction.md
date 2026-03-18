# Transaction Feature Documentation

## Table of Contents

- [Overview](#overview)
- [Core Operations](#core-operations)
- [Glossary](#glossary)
  - [`ITransaction` (Entity)](#itransaction-entity)
  - [`ITransactionItem` (Entity)](#itransactionitem-entity)
  - [`ETransactionType` (Type)](#etransactiontype-type)
  - [`ETransactionDirection` (Type)](#etransactiondirection-type)
  - [`ETransactionStatus` (Type)](#etransactionstatus-type)

## Overview

A **Transaction** in Ledgernova is a record of a financial or business event that changes the state of accounts. It acts as the definitive source of truth for movements of value—whether it is an exchange of money, the sale of goods, or an internal adjustment.

A transaction operates fundamentally on two levels:

1. **Transaction Header (`ITransaction`)**: The parent container grouping the business event's metadata (who, when, and where). It stores the aggregated amount, the main accounts involved, date, creator, notes, and overarching status.
2. **Transaction Items (`ITransactionItem`)**: The granular line items specifying _what exactly_ makes up the total value. Items break down the transaction by specific products, services, or categories, including quantities and unit prices. This granularity is essential for inventory management, detailed financial reporting, granular tax calculation, and understanding unit economics.

Depending on the nature of the event (`ETransactionType`), transactions specify an explicit business purpose (like a Sale, Purchase, or Transfer) and indicate the accounting flow of value (`ETransactionDirection`).

## Core Operations

The domain logic is highly encapsulated to ensure that transactions and their structural components are verified before persistence:

- **Transaction Creation (`transaction.entity.ts -> make`)**: Initializes a new transaction header.
  - Validates amounts, dates, the user (`createdBy`), and structurally necessitated fields (like `recipientAccountId` if the type is a `Transfer`).
  - For types that do not require items (e.g., transfers and manual journals), it solely creates the header.
  - For typical transactions (e.g., sales, purchases), it orchestrates the creation of the header alongside all provided transaction items to ensure totals match perfectly.
  - Transactions are initially created without attachments; `makeTransactionAttachments()` must be used subsequently.
  - Yields a `transaction.created` domain event (and subsequent item creation events).

- **Transaction Item Creation (`transaction-item.entity.ts -> make`)**: Represents the isolated economic event capturing category and amount necessary for tax computation and reporting.
  - Validates item prices against quantities and unit prices, and strictly verifies the applied category and its structural constraints.
  - **System Generation**: If an item is provided without an explicit name, the system treats the transaction header itself as the item, adopting the category's name and flagging the item as `isSystemGenerated = true`.
  - Distinguishes revenue vs. expense mathematically through its associated category ledger account type.
  - Yields a `transactionItem.created` domain event.

## Glossary

This section defines the key domain entities, types, and properties associated with the Transaction feature.

### `ITransaction` (Entity)

The top-level record encapsulating a single business event.

**Properties:**

- **`id`** (`string`): A globally unique UUID identifying the transaction.
- **`status`** (`UTransactionStatus`): The current state within the transaction lifecycle.
- **`createdBy`** (`string`): Identifies the user who created the transaction (distinct from the account owner, as creators may be delegates).
- **`type`** (`UTransactionType`): The business purpose classification.
- **`accountId`** (`string`): The primary account associated with the event.
- **`amount`** (`IMoney`): The aggregated absolute monetary value of the transaction.
- **`functionalCurrencyAmount`** (`IMoney`): The equivalent aggregated value calculated in the system's functional base currency.
- **`attachmentIds`** (`string[]`): References to supporting documents (receipts, invoices).
- **`items`** (`ITransactionItem[] | null`): The granular line items. Remains `null` for non-itemized operations like transfers or journals.
- **`date`** (`Date`): The effective date the event occurred.
- **`recipientAccountId`** (`string | null`): Used strictly for transfers to indicate the destination account.
- **`exchangeRate`** (`number`): The applied conversion rate against the functional currency.
- **`note`** (`string | null`): Optional supporting details.
- **`createdAt`** (`Date`): Timestamp indicating creation.
- **`updatedAt`** (`Date`): Timestamp indicating the last modification.
- **`deletedAt`** (`Date | null`): Timestamp used for soft-deletion.

### `ITransactionItem` (Entity)

An individual line item detailing a granular economic event within the parent transaction.

**Properties:**

- **`id`** (`string`): A unique UUID for the line item.
- **`name`** (`string`): The name of the item (falls back to category name if system generated).
- **`amount`** (`IMoney`): The specific monetary value of the line item in any currency.
- **`functionalCurrencyAmount`** (`IMoney`): The equivalent value in the functional base currency.
- **`quantity`** (`number`): The non-negative quantity of the line item.
- **`unitPrice`** (`IMoney | null`): The individual price per unit.
- **`transactionId`** (`string`): The UUID of the parent transaction header.
- **`category`** (`ICategory`): The deeply linked financial category necessary for ledger mapping and tax computation.
- **`isSystemGenerated`** (`boolean`): Flags if the item was automatically expanded from the parent without specific item definitions.
- **`createdAt`** (`Date`): Inherits the parent transaction's date.
- **`updatedAt`** (`Date`): Inherits the parent transaction's date.
- **`deletedAt`** (`Date | null`): Timestamp for soft-deletion.

### `ETransactionType` (Type)

Transactions are categorized by their business purpose, clarifying the nature of the event:

- **`Sale`** (`'sale'`): Revenue from selling goods or services.
- **`Purchase`** (`'purchase'`): Acquisition of goods or services.
- **`CreditNote`** (`'credit_note'`): Issued to a customer reversing a sale.
- **`DebitNote`** (`'debit_note'`): Issued to a supplier reversing a purchase.
- **`Expense`** (`'expense'`): Cost incurred for business operations.
- **`Transfer`** (`'transfer'`): Movement of funds internally between accounts.
- **`Payment`** (`'payment'`): Outflow of funds to settle an obligation.
- **`Receipt`** (`'receipt'`): Inflow of funds settling an invoice.
- **`Journal`** (`'journal'`): Manual adjusting entry.

### `ETransactionDirection` (Type)

Indicates the mathematical accounting flow of value for a given account.

- **`Debit`** (`'debit'`): Typically increases asset/expense accounts or decreases liability/revenue/equity accounts.
- **`Credit`** (`'credit'`): Typically increases liability/revenue/equity accounts or decreases asset/expense accounts.

### `ETransactionStatus` (Type)

Defines the current state of a transaction within its reporting lifecycle.

- **`Pending`** (`'pending'`): Initiated but awaiting approval or clearance. May not be finalized in balances.
- **`Posted`** (`'posted'`): Finalized, immutable, officially recorded affecting ledger balances.
- **`Voided`** (`'voided'`): Cancelled or invalidated retroactively, removing its impact on balances while retaining an audit trail.
- **`Archived`** (`'archived'`): Historical transaction from a closed accounting period, filtered from active operational views.
