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
- Uncleared transactions
- Down payments received
- Down payments made for property, plant & equipment

> [!INFO]
> It is important to note that by the end of the reporting year, all suspense accounts should be cleared.

Seeing that they are balance sheet accounts, in LedgerNova they can only be associated with asset and liability accounts.

Also, a suspense account can only be associated with one asset/liability account. If the account they are associated with is a control account, then the sub-ledger accounts under it will be associated with the suspense account.

## Asset Accounts (199xxx)

In the Asset ledger, a suspense account typically carries a debit balance. It represents a "pre-classification" of value that the company currently controls or has initiated. Here are some example use cases:

- Uncategorized credit transactions during bank reconciliation
- Uncleared/unidentified outgoing payments
- Duplicate outgoing payments to vendors
- Deposits for property, plant & equipment purchases

## Liability Accounts (299xxx)

In the Liability ledger, a suspense account typically carries a credit balance. It represents an obligation that the company has incurred but has not yet classified to a specific liability account. Here are some example use cases:

- Uncategorized debit transactions during bank reconciliation
- Uncleared/unidentified incoming payments
- Duplicate incoming payments
- Down payments for goods/services

> [!INFO]
> A suspense account CANNOT be created without an associated asset or liability account.
