# Accounting

## Philosophy

Our philosophy is to follow a reporting-first approach to accounting. This means that we will first determine the reporting requirements for each accounting domain and then create a set of ledger accounts that will allow us to generate the required reports. We will also create a set of behaviors that will be built into these ledger accounts and users will not be able to determine the behaviors of accounts.

## Reporting Needs

LedgerNova will support the following reporting for all three accounting domains:

### Individuals

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

### Sole Traders

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

### Organizations

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

## Reporting Requirements

For us to adequately generate the above reports, we need to ensure that our accounts are properly categorized. We also need to ship with meaningful transaction categories and ledger classes that will help the system with predefined behaviors.

To achieve this, we have modeled our accounts thus:

> [!INFO]
> A more contrived version will be displayed for non-accountant users in the individual accounting domain.
> Nonetheless, under the hood, this will be the complete structure

> [!INFO]
> LedgerNova manages account code allocation through **Sequential Slotting**.
> Users trigger account creation; the system assigns the next available code within the appropriate block to ensure structural integrity.

### Assets

![Assets Chart of Accounts](./assets/coa-assets.svg)

## Liabilities

![Liabilities Chart of Accounts](./assets/coa-liabilities.svg)

### Equities

![Equities Chart of Accounts](./assets/coa-equities.svg)

### Revenues

![Revenues Chart of Accounts](./assets/coa-revenues.svg)

### Expenses

![Expenses Chart of Accounts](./assets/coa-expenses.svg)
