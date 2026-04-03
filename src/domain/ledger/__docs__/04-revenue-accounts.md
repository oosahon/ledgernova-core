# Revenue Accounts

## Table of Contents

- [Introduction](#introduction)
- [Operating Revenues](#operating-revenues)
  - [Sales](#sales)
  - [Services](#services)
  - [Subscriptions](#subscriptions)
  - [Employment Income](#employment-income)
- [Non-Operating Revenues](#non-operating-revenues)
  - [Interest Income](#interest-income)
  - [Gain on Sale of Assets](#gain-on-sale-of-assets)
  - [Unrealized Gains](#unrealized-gains)
- [Application Bootstrap](#application-bootstrap)
  - [Individual](#individual)

## Introduction

Revenue ledgers are used to track the income earned by an individual, sole trader, or company from its normal business operations and other incidental activities. Per our [accounting philosophy](../../accounting/__doc__/accounting.md#philosophy), our revenue ledgers are structured with reporting in mind to distinctly separate core operational performance from other income sources.

Revenue ledgers come in two reporting hierarchies:

- Operating Revenues
- Non-Operating Revenues

When a revenue ledger/sub-ledger is created, it MUST be associated with one of the two reporting hierarchies.

By default, standard revenue accounts carry a **credit** normal balance. **Contra-revenue accounts** (like Returns and Discounts) carry a **debit** normal balance as they act to reduce gross revenue. Contra-revenue accounts are created relationally within their parent's code range and are distinguished by their flipped `normalBalance` and `IAdjustmentMetaData`. See [ADR-0012](../../../../docs/adrs/0012-relational-contra-adjunct-accounts.md) for the full design rationale.

To ensure our system is extensible, we have not baked functionalities into ledger codes or predefined accounts. For non-power users, our ledger accounts bootstrap will handle the creation of accounts and association of behaviors. For power users, they can create accounts and associate behaviors available to the account class.

The following table shows the behaviors of different revenue account classes:

## Operating Revenues

### Sales

- **Ledger codes**: 400xxx
- **Description**: accounts used to track gross revenue earned from the sale of physical goods or products.
- **Main reporting hierarchy**: Operating Revenues / Sales

#### Behaviors

| Sub-Class | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                                                                                                                                                    |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sales     | /                   | <ul><li>Requires sales invoice or cash receipt transaction for creation</li><li>Automatically closed to Retained Earnings at period-end</li><li>Supports adjunct accounts</li><li>Contra accounts (Returns, Refunds, Discounts) are created relationally within the 400xxx range with a flipped normal balance and mandatory `IAdjustmentMetaData`</li></ul> |

### Services

- **Ledger codes**: 401xxx
- **Description**: accounts used to track gross revenue earned from providing professional services, consulting, or labor.
- **Main reporting hierarchy**: Operating Revenues / Services

#### Behaviors

| Sub-Class | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                                                                                                                                      |
| --------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Services  | /                   | <ul><li>Requires sales invoice or payment receipt transaction for creation</li><li>**Requires counterparty location metadata** for accurate statutory/tax calculations (e.g., VAT/WHT/Export)</li><li>Supports accrual rules out of Unbilled Assets (Accrued Income)</li><li>Automatically closed to Retained Earnings at period-end</li></ul> |

### Subscriptions

- **Ledger codes**: 402xxx
- **Description**: accounts used to track recurring revenue from subscripted access to products, software, or ongoing services.
- **Main reporting hierarchy**: Operating Revenues / Subscriptions

#### Behaviors

| Sub-Class     | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                        |
| ------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subscriptions | /                   | <ul><li>Requires recurring invoice or deferred revenue amortization schedule for creation</li><li>Supports automated revenue recognition run schedules</li><li>Automatically closed to Retained Earnings at period-end</li></ul> |

### Employment Income

- **Ledger codes**: 403xxx
- **Description**: accounts used to track gross salary, wages, and other employment compensation received from an employer (subject to PAYE).
- **Main reporting hierarchy**: Operating Revenues / Employment Income

#### Behaviors

| Sub-Class         | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                                                                                                                                                    |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Employment Income | /                   | <ul><li>**Requires Employer Onboarding** to capture contract nature, jurisdiction/location, and tax responsibility (e.g., PAYE obligation)</li><li>Requires a payslip or net deposit journal for creation</li><li>Supports gross-to-net accounting (tracking PAYE, Pensions, etc.)</li><li>Automatically closed to Retained Earnings at period-end</li></ul> |

## Non-Operating Revenues

### Interest Income

- **Ledger codes**: 404xxx
- **Description**: accounts used to track income earned from cash balances, term deposits, or financing provided to others, separated from core operational performance.
- **Main reporting hierarchy**: Non-Operating Revenues / Interest Income

#### Behaviors

| Sub-Class       | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                                          |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Interest Income | /                   | <ul><li>Requires bank statement reconciliation or automated interest accrual schedule</li><li>Often linked directly as an adjunct to Short/Long Term Investment accounts</li><li>Automatically closed to Retained Earnings at period-end</li></ul> |

### Gain on Sale of Assets

- **Ledger codes**: 405xxx
- **Description**: accounts used to track the net financial gain resulting from the disposal/sale of Property, Plant & Equipment or Long Term Investments above their carrying (book) value.
- **Main reporting hierarchy**: Non-Operating Revenues / Gain on Sale of Assets

#### Behaviors

| Sub-Class    | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                  |
| ------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gain on Sale | /                   | <ul><li>Requires an asset disposal transaction for creation</li><li>Automatically calculates difference between sale proceeds and net book value</li><li>Automatically closed to Retained Earnings at period-end</li></ul> |

### Unrealized Gains

- **Ledger codes**: 406xxx
- **Description**: accounts used to track positive mark-to-market valuations (paper gains) on short-term trading assets, marketable securities, or foreign exchange (FX) balances before they are sold or settled.
- **Main reporting hierarchy**: Non-Operating Revenues / Unrealized Gains

#### Behaviors

| Sub-Class        | Reporting Hierarchy | Behaviors                                                                                                                                                                                                                    |
| ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unrealized Gains | /                   | <ul><li>Created via automated period-end revaluation runs or manual mark-to-market journal entries</li><li>Counterpart to an asset adjunct account</li><li>Automatically closed to Retained Earnings at period-end</li></ul> |

## Application Bootstrap

For non-power users, we want to bootstrap their ledger accounts with a set of default accounts based on their domain.

### Individual

For an individual, the following revenue accounts will be bootstrapped:

#### Operating Revenues

- Sales: `400000` (control account)
- Services: `401000` (control account)
- Subscriptions: `402000` (control account)
- Employment Income: `403000` (control account)

#### Non-Operating Revenues

- Interest Income: `404000` (control account)
- Gain on Sale of Assets: `405000` (control account)
- Unrealized Gains: `406000` (control account)

> [!NOTE]
> All revenue ledgers are automatically cleared and closed out to `RetainedEarnings (301000)` at the end of the financial/accounting period.
