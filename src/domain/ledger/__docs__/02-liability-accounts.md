# Liability Accounts

## Table of Contents

- [Introduction](#introduction)
- [Current Liabilities](#current-liabilities)
  - [Short Term Debts](#short-term-debts)
  - [Payables](#payables)
  - [Accrued Expenses](#accrued-expenses)
  - [Deferred Revenues](#deferred-revenues)
- [Non-Current Liabilities](#non-current-liabilities)
  - [Long Term Loans](#long-term-loans)
  - [Lease Liabilities & Provisions](#lease-liabilities--provisions)
- [Suspense Accounts:](#suspense-accounts)
- [Application Bootstrap](#application-bootstrap)
  - [Individual](#individual)

## Introduction

Liability ledgers are used to track what an individual, sole trader or company owes. Per our [accounting philosophy](../../accounting/__doc__/accounting.md#philosophy), our liability ledgers are structured with reporting in mind.

Liability ledgers come in two reporting hierarchies:

- Current Liabilities
- Non-Current Liabilities

When a liability ledger/sub-ledger is created, it MUST be associated with one of the two reporting hierarchies.

By default, liability accounts carry a **credit** normal balance. This is automatically derived from the account type during creation.

To ensure our system is extensible, we have not baked functionalities into ledger codes or predefined accounts. For non-power users, our ledger accounts bootstrap will handle the creation of accounts and association of behaviors. For power users, they can create accounts and associate behaviors available to the account class.

The following table shows the behaviors of different liability account classes

## Current Liabilities

### Short Term Debts

- **Ledger codes**: 200xxx
- **Description**: accounts that are used to track short-term borrowings, such as overdrafts, credit card balances, or short-term personal loans.
- **Main reporting hierarchy**: Current Liabilities / Short Term Debts

#### Behaviors

| Sub-Class        | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                 |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Credit Cards     | /                   | <ul><li>Requires purchase/charge transaction for creation</li><li>Requires payment transaction for settlement</li><li>Supports manual reconciliations</li><li>Supports adjunct accounts (for interest and fees)</li></ul> |
| Overdrafts       | /                   | <ul><li>Automatically created if a linked bank account goes negative</li><li>Requires deposit transaction for settlement</li></ul>                                                                                        |
| Short Term Loans | /                   | <ul><li>Requires funding transaction for creation</li><li>Requires repayment transaction for settlement</li><li>Supports automated interest accrual</li></ul>                                                             |

### Payables

- **Ledger codes**: 201xxx
- **Description**: accounts that are used to track amounts owed to suppliers, vendors, and statutory authorities.
- **Main reporting hierarchy**: Current Liabilities / Payables

#### Behaviors

| Sub-Class          | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                                                                                                         |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trade Payables     | /                   | <ul><li>Requires invoice or credit note transaction for creation</li><li>Requires payment or debit note transaction for settlement</li><li>Supports automated aging</li><li>Supports contra accounts (for early payment discounts)</li><li>Supports adjunct accounts (for interest on overdue accounts)</li></ul> |
| Statutory Payables | /                   | <ul><li>Requires tax computation or manual entry for creation</li><li>Requires statutory payment transaction for settlement</li><li>Does not support contra accounts</li><li>Does not support adjunct accounts</li></ul>                                                                                          |

### Accrued Expenses

- **Ledger codes**: 202xxx

> [!INFO]
> Out of scope for MVP (individual domain).
> These classes will be scoped when we move to support sole traders.

### Deferred Revenues

- **Ledger codes**: 203xxx

> [!INFO]
> Out of scope for MVP (individual domain).
> These classes will be scoped when we move to support sole traders. Deferred revenues are primarily business functions.

## Non-Current Liabilities

### Long Term Loans

- **Ledger codes**: 204xxx
- **Description**: accounts used to track borrowings the entity intends to pay back over a period longer than 12 months (e.g., mortgages, student loans, auto loans).
- **Main reporting hierarchy**: Non-Current Liabilities / Long Term Loans

#### Behaviors

| Sub-Class             | Reporting Hierarchy | Behaviors                                                                                                                                                                                                  |
| --------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mortgages             | /                   | <ul><li>Requires origination transaction for creation</li><li>Requires scheduled payments for settlement (handling principal and interest breakdown)</li><li>Supports automated interest accrual</li></ul> |
| Other Long Term Loans | /                   | <ul><li>Requires funding transaction for creation</li><li>Requires scheduled repayment rules</li><li>Supports adjunct accounts (for accrued interest if not managed separately)</li></ul>                  |

### Lease Liabilities & Provisions

- **Ledger codes**: 205xxx, 206xxx

> [!INFO]
> Out of scope for MVP.
> These advanced liability classes are purposefully excluded from the initial release to maintain system simplicity for non-power users. The ledger code blocks are permanently reserved for future enterprise compliance features.

## Suspense Accounts:

- **Ledger codes**: 299xxx
- **Description**: See [Suspense Accounts](./suspense-accounts.md) for more information.

#### Behaviors

| Sub-Class | Reporting Hierarchy            | Behaviors                                                                                                                                                                         |
| --------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \*        | (TBD - Depends on the balance) | <ul><li>Adjunct accounts prohibited</li><li>Contra accounts prohibited</li><li>Must be reconciled and cleared to a zero balance prior to period-end financial reporting</li></ul> |

## Application Bootstrap

For non-power users, we want to bootstrap their ledger accounts with a set of default accounts based on their domain.

### Individual

For an individual the following accounts will be bootstrapped:

#### Current Liabilities

- ShortTermDebts: `200000` (control account)
- Payables: `201000` (control account)
  - Statutory Payables: `201001` (control account)
    - Personal Income Tax: `201002` (sub-ledger)
- Suspense Accounts: `299000`

#### Non Current Liabilities

- LongTermLoans: `204000` (control account)

> [!NOTE]
> An opening balance equity account will also be created for each of the control accounts above.
