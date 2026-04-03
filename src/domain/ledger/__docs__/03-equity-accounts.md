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

By default, equity accounts carry a **credit** normal balance. This is automatically derived from the account type during creation.

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
- **Description**: accounts used to track reserves. These accounts are typically used to set aside funds for specific purposes, such as future investments, contingencies, or dividends. They are also used to track the revaluation of assets and liabilities.
- **Main reporting hierarchy**: Equity / Reserves

#### Behaviors

| Sub-Class | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                        |
| --------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reserves  | /                   | <ul><li>Automatically updated during period-end closing procedures</li><li>Direct manual journal entries are generally restricted (except for prior period adjustments)</li><li>Contra and Adjunct accounts prohibited</li></ul> |

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

- OwnerCapital: `300000`
- RetainedEarnings: `301000`
- OpeningBalanceEquity: `399000`

> [!NOTE]
> Reserves (`302xxx`) are not bootstrapped for individuals. The Revaluation Reserve entity is available for power users or will be created on demand if an individual revalues PPE or long-term investments.

> [!NOTE]
> All asset and liability bootstrapped accounts will automatically post their initial balances against the Opening Balance Equity (`399000`) control account.
