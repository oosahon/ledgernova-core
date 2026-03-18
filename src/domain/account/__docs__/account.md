# Account Feature Documentation

## Table of Contents

- [Overview](#overview)
- [Core Operations](#core-operations)
- [Glossary](#glossary)
  - [\`IAccount\` (Entity)](#iaccount-entity)
  - [\`EAccountStatus\` (Type)](#eaccountstatus-type)
  - [\`ELedgerAccountType\` (Type)](#eledgeraccounttype-type)
  - [\`IAccountWithCurrency\` (Extended Type)](#iaccountwithcurrency-extended-type)

## Overview

An account in Ledgernova is a representation of a user's monetary store. It is directly mapped to proper accounting ledger types, ensuring compliance with standard accounting principles. Accounts are foundational to everything that we do within the system; from complex double-entry accounting to precise tax computations.

The domain logic is highly encapsulated, ensuring that entities are created and modified consistently while generating appropriate domain events for reactive processing.

## Core Operations

The `account.entity.ts` module defines the pure business logic and lifecycle operations for an account:

- **Creation (`make`)**: Initializes a new account with a generated UUID, sets the status to `Active`, and records creation timestamps. It rigorously validates the `currencyCode` and `type`, and sanitizes the `name` and `subType`. This operation yields the new account and an `account.created` event.
- **Balance Calculation (`getBalance`)**: Computes the true balance of the account derived from aggregate debits and credits, contextualized by its ledger type. It strictly adheres to normal balance rules:
  - **Asset & Expense accounts**: `Total Debit - Total Credit`
  - **Liability, Equity & Revenue accounts**: `Total Credit - Total Debit`
- **Updates (`update`)**: Modifies the account's `name`, `subType`, or `currencyCode`. Includes validation for the new currency code and sanitization for text fields. Yields an updated account and an `account.updated` event.
- **State Management (`archive` & `unarchive`)**: Idempotently transitions the account status between `Active` and `Archived`. Each successful transition yields its respective domain event (`account.archived` or `account.unarchive`).

## Glossary

This section defines the key domain entities, types, and properties associated with the Account feature.

### `IAccount` (Entity)

The primary data structure representing a financial ledger account.

**Properties:**

- **`id`** (`string`): A unique UUID identifying the account globally.
- **`userId`** (`string`): The unique identifier of the user (or tenant) who owns this account.
- **`status`** (`UAccountStatus`): The current operational state of the account. Defaults to `active`.
- **`name`** (`string`): A human-readable name for the account (e.g., "Main Wallet", "Sales Income"). It is sanitized, trimmed, and restricted to a maximum of 100 characters.
- **`type`** (`ULedgerAccountType`): The strict accounting classification used to define ledger behavior.
- **`subType`** (`string | null`): An optional, granular classification to further categorize the account internally. It is also sanitized and limited to 100 characters.
- **`currencyCode`** (`string`): The standard ISO 4217 currency code representing the financial denomination (e.g., "USD", "NGN").
- **`createdAt`** (`Date`): Timestamp indicating when the account record was created.
- **`updatedAt`** (`Date`): Timestamp indicating the last time the account was modified.
- **`deletedAt`** (`Date | null`): Timestamp used for soft-deletion purposes.

### `EAccountStatus` (Type)

Enumeration detailing the operational states an account can assume.

- **`Active`** (`'active'`): The account is fully functional and can be involved in standard transactions.
- **`Archived`** (`'archived'`): The account is explicitly hidden or sidelined. It cannot typically be used in new transactions but remains in historical records.

### `ELedgerAccountType` (Type)

Enumeration of the fundamental pillars of double-entry accounting. These define how balances are calculated and how the account reacts to debits and credits.

- **`Asset`** (`'asset'`): Resources owned that provide future economic value. (Normal balance: Debit)
- **`Liability`** (`'liability'`): Obligations or amounts owed to external parties. (Normal balance: Credit)
- **`Revenue`** (`'revenue'`): Income earned through regular operations. (Normal balance: Credit)
- **`Expense`** (`'expense'`): Costs incurred to generate revenue. (Normal balance: Debit)
- **`Equity`** (`'equity'`): The owner's residual interest after deducting liabilities from assets. (Normal balance: Credit)

### `IAccountWithCurrency` (Extended Type)

An aggregation type used primarily on the read side. It extends the base `IAccount` to embed the fully resolved `ICurrency` object, rather than just retaining the `currencyCode`.
