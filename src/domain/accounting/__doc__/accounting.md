# Accounting

## Philosophy

Our philosophy is to follow a reporting-first approach to accounting. This means that we will first determine the reporting requirements for each accounting domain and then create a set of ledger accounts that will allow us to generate the required reports. We will also create a set of behaviors that will be built into these ledger accounts and users will not be able to determine the behaviors of accounts.

## Reporting Needs

LedgerNova will support the following reporting for all three accounting domains:

#### Individuals

- Personal Income Statement
- Expense & Spending Analysis
- Personal Cash Flow Statement (SoCF)
- Budget vs. Actual (BvA) Report
- Statement of Net Worth
- Consolidated Account Balances
- Debt & Liability Aging Report
- Savings & Financial Goals Tracker
- Investment Portfolio Performance
- Personal Income Tax (PIT) Summary
- Recurring Transactions & Subscription Audit
- Financial Trends & Custom Analytics

#### Sole Traders

- Statement of Profit or Loss (SoPL)
- Statement of Financial Position (SoFP)
- Statement of Cash Flows (SoCF)
- Aged Receivables Ledger
- Aged Payables Ledger
- Sales & Revenue Performance Report
- Expense & Overheads Analysis
- Statutory Returns (VAT/WHT)
- Bank Reconciliation Statement
- Inventory Valuation Report (IVR)
- Payroll & Personal Income Tax (PIT) Remittance
- Budget vs. Actual (BvA) Report
- Statement of Owner’s Equity
- Fixed Asset Register (FAR)
- Break-even Analysis Report
- Working Capital & Liquidity Report

#### Organizations

- Statement of Profit or Loss (SoPL)
- Statement of Financial Position (SoFP)
- Statement of Cash Flows (SoCF)
- Statement of Changes in Equity (SoCE)
- Aged Receivables Ledger
- Aged Payables Ledger
- Trial Balance (TB)
- Fixed Asset Register (FAR)
- Inventory Valuation Report (IVR)
- Bank Reconciliation Statement
- Budget vs. Actual (BvA) Report
- Cash Flow Forecast
- Segment/Divisional Performance Report
- Statutory Tax Returns (VAT/WHT/CIT)
- General Ledger (GL) Audit Trail
- Cost of Goods Manufactured (COGM)
- Working Capital & Liquidity Report
- Payroll & Statutory Remittance Report
- Intercompany Elimination Report
- Break-even Analysis Report

### Reporting Requirements

For us to adequately generate the above reports, we need to ensure that our accounts are properly categorized. We also need to ship with meaningful transaction categories and ledger classes that will help the system with predefined behaviors.

To achieve this, we have modeled our Charts of Accounts thus:

## Charts of Accounts

Our Chart of Accounts will follow a 6-digit coding structure: A-BB-CC-(D). Where:

- **A** represents the account type (Asset, Liability, Equity, Revenue, Expense)
- **BB** represents the header and sub-headers (eg. Current Assets, Operating Expenses, etc )
- **CC** represents control accounts
- **(D)** represents account adjustment behavior (basis(0)/adjunct(1)/contra(9))

Codes will be allocated through **Sequential Slotting**.

For users who migrate from other systems to ours, we will preserve their ledger codes in the db level (`external_ledger_code`), but internally we will follow our strict nomenclature. Also, we will allow users to choose what code to display on the UI.

> [!INFO]
> A more contrived version will be displayed for non-accountant users in the individual accounting domain.
> Nonetheless, under the hood, this will be the complete structure

> [!WARNING]
> Adjustment accounts (Basis/Adjunct/Contra) will only live at the control account levels.
> Sub ledgers will not have theirs, but post to their respective control account's, attaching their respective account ids

### Assets

![Assets Chart of Accounts](./assets/coa-assets.svg)
_Figure 1: View the mermaid sourcecode here:&#x20;_[_coa-assets.mermaid_](./assets/coa-assets.mermaid)

## Liabilities

![Liabilities Chart of Accounts](./assets/coa-liabilities.svg)
_Figure 2: View the mermaid sourcecode here:&#x20;_[_coa-liabilities.mermaid_](./assets/coa-liabilities.mermaid)

### Equities

![Equities Chart of Accounts](./assets/coa-equities.svg)
_Figure 3: View the mermaid sourcecode here:&#x20;_[_coa-equities.mermaid_](./assets/coa-equities.mermaid)

### Revenues

![Revenues Chart of Accounts](./assets/coa-revenues.svg)
_Figure 4: View the mermaid sourcecode here:&#x20;_[_coa-revenues.mermaid_](./assets/coa-revenues.mermaid)

### Expenses

![Expenses Chart of Accounts](./assets/coa-expenses.svg)
_Figure 5: View the mermaid sourcecode here:&#x20;_[_coa-expenses.mermaid_](./assets/coa-expenses.mermaid)
