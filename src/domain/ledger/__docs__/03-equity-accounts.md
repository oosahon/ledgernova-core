# Equity Accounts

## Table of Contents

- [Introduction](#introduction)
- [Capital](#capital)
- [Retained Earnings](#retained-earnings)
- [Reserves](#reserves)
- [Opening Balance Equity](#opening-balance-equity)
- [Application Bootstrap](#application-bootstrap)
  - [Individual](#individual)

## Introduction

Equity ledgers are used to track the residual interest in the assets of the entity after deducting all its liabilities (Net Worth). Per our [accounting philosophy](../../accounting/__doc__/accounting.md#philosophy), our equity ledgers are structured with reporting in mind.

By default, equity accounts carry a credit balance.

To ensure our system is extensible, we have not baked functionalities into ledger codes or predefined accounts. For non-power users, our ledger accounts bootstrap will handle the creation of accounts and association of behaviors. For power users, they can create accounts and associate behaviors available to the account class.

The following table shows the behaviors of different equity account classes

## Capital

- **Ledger codes**: 300xxx
- **Description**: accounts used to track the initial or subsequent direct investments/contributions made by the owner(s) into the entity. For individuals, this represents their base personal capital.
- **Main reporting hierarchy**: Equity / Capital

#### Behaviors

| Sub-Class     | Reporting Hierarchy | Behaviors                                                                                                                                                                          |
| ------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owner Capital | /                   | <ul><li>Requires deposit transaction for creation / contribution</li><li>Requires withdrawal/draw transaction for reduction</li><li>Supports adjunct and contra accounts</li></ul> |

## Retained Earnings

- **Ledger codes**: 301xxx
- **Description**: accounts used to track the accumulated net income/loss of the entity. At the end of each financial period, the net balance of all Revenue and Expense accounts is closed out into Retained Earnings.
- **Main reporting hierarchy**: Equity / Retained Earnings

#### Behaviors

| Sub-Class         | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                        |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retained Earnings | /                   | <ul><li>Automatically updated during period-end closing procedures</li><li>Direct manual journal entries are generally restricted (except for prior period adjustments)</li><li>Contra and Adjunct accounts prohibited</li></ul> |

## Reserves

- **Ledger codes**: 302xxx

> [!INFO]
> Out of scope for MVP (individual domain).
> These classes (Revaluation Reserves, etc.) will be scoped when we move to support complex sole traders and corporate entities.

## Opening Balance Equity

- **Ledger codes**: 399xxx
- **Description**: A temporary suspense-like account used during system onboarding to hold the offset of initial asset and liability balances until they are formally distributed to Capital or Retained Earnings.
- **Main reporting hierarchy**: Equity / Opening Balance Equity

#### Behaviors

| Sub-Class | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                                                                 |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \*        | (TBD)               | <ul><li>Requires manual journal entry balancing during trial balance import</li><li>Adjunct accounts prohibited</li><li>Contra accounts prohibited</li><li>Must be reconciled and cleared to a zero balance out to Retained Earnings or Capital after bootstrap</li></ul> |

## Application Bootstrap

For non-power users, we want to bootstrap their ledger accounts with a set of default accounts based on their domain.

### Individual

For an individual, the following accounts will be bootstrapped:

#### Equity

- OwnerCapital: `300000` (control account)
- RetainedEarnings: `301000` (control account)
- OpeningBalanceEquity: `399000` (control account)

> [!NOTE]
> All asset and liability bootstrapped accounts will automatically post their initial balances against the Opening Balance Equity (`399000`) control account.
