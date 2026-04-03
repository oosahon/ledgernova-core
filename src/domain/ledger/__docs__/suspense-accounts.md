# Suspense Accounts

## Table of Contents

- [Introduction](#introduction)
- [Asset Accounts](#asset-accounts)
- [Liability Accounts](#liability-accounts)

## Introduction

Suspense accounts are temporary balance sheet accounts that are used to hold transactions that cannot be classified to a specific account. They are typically used in the following scenarios:

- Bank Reconciliation
- Trial Balance Adjustments (for power users)
- Uncategorized transactions

> [!INFO]
> It is important to note that by the end of the reporting year, all suspense accounts should be cleared.

In LedgerNova, we use one liability/asset suspense account per accounting entity, per operating currency. That is, if the accounting entity has multiple operating currencies, it will have multiple liability/asset suspense accounts.

## Asset Accounts (199xxx)

In the Asset ledger, a suspense account typically carries a debit balance. It represents a "pre-classification" of value that the company currently controls or has initiated. Here are some example use cases:

- Uncategorized credit transactions during bank reconciliation
- Uncleared/unidentified outgoing payments

## Liability Accounts (299xxx)

In the Liability ledger, a suspense account typically carries a credit balance. It represents an obligation that the company has incurred but has not yet classified to a specific liability account. Here are some example use cases:

- Uncategorized debit transactions during bank reconciliation
- Uncleared/unidentified incoming payments
