# Category Feature Documentation

## Table of Contents

- [Overview](#overview)
- [Core Operations](#core-operations)
- [Glossary](#glossary)
  - [`ICategory` (Entity)](#icategory-entity)
  - [System Categories vs User Categories](#system-categories-vs-user-categories)
  - [`EAccountingEntityType` (Type)](#EAccountingEntityType-type)
  - [`ECategoryStatus` (Type)](#ecategorystatus-type)
  - [`ECategoryFlowType` (Type)](#ecategoryflowtype-type)

## Overview

In Ledgernova, a **Category** is more than just a visual tag for an income or expense transaction. It is a foundational component deeply intertwined with accounting principles and tax rules.

While typical budgeting apps use categories solely for grouping transactions by name, Ledgernova categories act as the bridge between user-friendly labels (e.g., "Office Supplies") and the strict accounting parameters required to run a proper ledger (e.g., mapping to a receipt transaction to a liability account without the user explicitly doing this).

Because Ledgernova supports fundamentally different types of accounting structures, each category is strongly linked to an **Accounting Domain** (`UaccountingEntityType`) such as Corporate, SoleTrader, or Personal. Categories adapt to the legal and structural needs of their target domain.

Every category must anchor to a [transaction type](../../transaction/__docs__/transaction.md) . This ensures that when a transaction is categorized, the system inherently knows its financial impact on the Chart of Accounts.

## Core Operations

The `category.entity.ts` module defines the pure business logic and lifecycle operations for a category:

- **Creation (`make`)**: Initializes a new category with a generated UUID, assigns a dynamic `taxKey`, and sets the status to `Active`. It validates the `transactiionType`, `accountingEntityType`, and sanitizes both `name` and `description`. This operation yields the new category and a `category.created` event.
- **Updates (`update`)**: Modifies the category's `name` or `description`. Includes sanitation ensuring descriptions are capped at 255 characters. Yields an updated category and a `category.updated` event.
- **State Management (`archive` & `unarchive`)**: Idempotently transitions the category status between `Active` and `Archived`. Each successful transition yields its respective domain event (`category.archived` or `category.unarchived`). Note that archiving preserves the category's historical linkage to transactions without breaking older reports.

## Glossary

This section defines the key domain entities, types, and properties associated with the Category feature.

### `ICategory` (Entity)

The primary data structure representing a financial category.

**Properties:**

- **`id`** (`string`): A uniquely generated UUID identifying the category globally.
- **`name`** (`string`): The sanitized, user-friendly name of the category.
- **`accountingEntityType`** (`UaccountingEntityType`): The legal accounting structure this category applies to (e.g., Corporate, Personal).
- **`transactionType`** (`UTransactionType`): The strict accounting classification used a transaction or its item.
- **`taxKey`** (`string`): Dictates the underlying tax treatment and reporting rules governing any transaction placed in this category.
- **`status`** (`UCategoryStatus`): The current operational state of the category. Defaults to `active`.
- **`description`** (`string`): An optional, sanitized descriptive text allowing up to 255 characters.
- **`parentId`** (`string | null`): Identifies the parent category, supporting structural hierarchy and nested sub-categories.
- **`userId`** (`string | null`): Identifies the user (or tenant) who owns the category.
- **`createdAt`** (`Date`): Timestamp indicating when the category record was created.
- **`updatedAt`** (`Date`): Timestamp indicating the last time the category was modified.
- **`deletedAt`** (`Date | null`): Timestamp used for soft-deletion purposes.

### System Categories vs User Categories

Categories in Ledgernova fall into two distinct ownership paradigms, delineated by the presence or absence of a `userId`:

#### System Categories

These are foundational, built-in categories provided by the platform (e.g., standard Tax, core Revenue). They cannot be modified or archived by individual users and are typically globally available to users within their respective `accountingEntityType`.

#### User Categories

These are custom categories created by a specific user or tenant to fit their specific workflow. They are completely isolated, meaning they are only visible and accessible to the user who owns them.

**NB**: Every user category MUST Be created off a system category, inheriting the tax key and ledger account type from its parent.

### `EAccountingEntityType` (Type)

Enumeration detailing the legal accounting domains supported.

- **`Corporate`** (`'corporate'`): For registered businesses with complex corporate tax requirements.
- **`SoleTrader`** (`'sole_trader'`): For independent contractors and freelancers.
- **`Personal`** (`'personal'`): For individual personal finance tracking.

### `ECategoryStatus` (Type)

Enumeration detailing the operational states a category can assume.

- **`Active`** (`'active'`): The category is fully functional and can be selected for standard categorizations.
- **`Archived`** (`'archived'`): The category is explicitly hidden from active use but remains intact for historical records.

### `ECategoryFlowType` (Type)

Enumeration strictly for UX/presentation layers, determining whether the category nominally represents an inflow or outflow of funds.

- **`In`** (`'in'`): The category generally represents incoming money.
- **`Out`** (`'out'`): The category generally represents outgoing money.
